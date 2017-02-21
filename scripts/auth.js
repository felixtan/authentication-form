module.exports = (db) => {
  
  const passport = require('passport')
  const Strategy = require('passport-local').Strategy
  const bcrypt = require('bcrypt')
  const saltRounds = 10
  const encodeURIComponentEnhanced = require('./helpers').encodeURIComponentEnhanced
  const errorMessages = require('./helpers').messages

  passport.serializeUser((user, cb) => {
    cb(null, user.email)
  })

  passport.deserializeUser((email, cb) => {
    const user = db.exec(`SELECT * FROM users WHERE email=${JSON.stringify(email)} LIMIT 1`)[0]

    if (user === null && user === undefined) {
      cb(new Error('user not found'))
    } else {
      cb(null, prettifyUser(user))
    }
  })

  passport.use('local-login', new Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
  }, (req, email, password, cb) => {

    // User is already authenticated
    if (req.user !== undefined && req.user !== null && encodeURIComponent(email) === req.user.email) {
      return cb(null, req.user, {
        status: 200,
        error: false,
        clientMessage: 'You are already logged in!',
        serverMessage: `User ${req.user.email} tried to log in but was already authenticated.`
      })
    }

    let user = null
    try {
      user = db.exec(`SELECT * FROM users WHERE email=${JSON.stringify(encodeURIComponent(email))} LIMIT 1`)[0]
      user = prettifyUser(user)

      try {
        bcrypt.compare(encodeURIComponentEnhanced(password), user.password, (err, match) => {
          if (match) {
            return cb(null, user, {
              status: 200,
              error: false,
              clientMessage: 'Successful login',
              serverMessage: `Successful login for ${user.email}`
            })
          } else {
            return cb(null, false, {
              status: 401,
              clientMessage: errorMessages.failedAttemptMessage,
              serverMessage: 'Password did not match.'
            })
          }
        })
      } catch (err) {
        // TODO: log this to server logs
        if (user === null || user === undefined) {
          return cb(null, false, {
            error: true,
            status: 404,
            clientMessage: errorMessages.failedAttemptMessage,
            serverMessage: 'Email not found in db.'
          })
        } else {
          return cb(err, false, {
            error: true,
            status: 500,
            clientMessage: errorMessages.serverErrorMessage,
            serverMessage: err
          })
        }
      }

    } catch (err) {
        return cb(err, false, {
          error: true,
          status: 500,
          clientMessage: errorMessages.serverErrorMessage,
          serverMessage: err
        })
    }
  }))

  passport.use('local-signup', new Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
  }, (req, email, password, cb) => {

    const checkUser = db.exec(`SELECT * FROM users WHERE email=${JSON.stringify(encodeURIComponent(email))} LIMIT 1`)[0]

    if (checkUser !== null && checkUser !== undefined) {
      return cb(null, false, {
        error: true,
        status: 409,
        clientMessage: errorMessages.emailAlreadyExists,
        serverMessage: `Email ${email} already exists in the database.`
      })
    }

    try {
      bcrypt.hash(encodeURIComponentEnhanced(password), saltRounds, (err, hash) => {
        if (err) {
          return cb(err, false, {
            error: true,
            status: 500,
            clientMessage: errorMessages.serverErrorMessage,
            serverMessage: `bcrypt.hash returned error: ${err}`
          })
        }

        const user = {
          name: encodeURIComponent(req.body.fullName),
          company: encodeURIComponent(req.body.companyName),
          email: encodeURIComponent(req.body.email),
        }

        try {
          const insertUserStatement = db.prepare('INSERT INTO users VALUES (:name, :company, :email, :password);')

          insertUserStatement.bind({
            ':name': user.name,
            ':company': user.company,
            ':email': user.email,
            ':password': hash
          })

          insertUserStatement.step()

          return cb(null, user, {
            error: false,
            status: 201,
            clientMessage: `User ${user.name} created.`,
            serverMessage: `User ${user.name} created`
          })

        } catch (err) {
          return cb(err, false, {
            error: true,
            status: 500,
            clientMessage: errorMessages.serverErrorMessage,
            serverMessage: `Error inserting user into db: ${err}`
          })
        }

      })

    } catch (err) {
      return cb(err, false, {
        error: true,
        status: 500,
        clientMessage: errorMessages.serverErrorMessage,
        serverMessage: err
      })
    }
  }))

  return passport

  // Does not decode user data
  function prettifyUser (userFromDb) {
    if (userFromDb === null || userFromDb === undefined) return userFromDb

    const data = {}
    userFromDb.columns.forEach((field, index) => {
      data[field] = userFromDb.values[0][index]
    })
    return data
  }
}

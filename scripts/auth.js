module.exports = (db) => {

  const passport = require('passport')
  const Strategy = require('passport-local').Strategy
  const bcrypt = require('bcrypt')
  const saltRounds = 10
  const errorMessages = require('./helpers').messages
  const getUserByEmail = require('./helpers').getUserByEmail

  passport.serializeUser((user, cb) => {

    cb(null, user.email)

  })

  passport.deserializeUser((email, cb) => {

    // Check here, if getting Error: Failed to deserialize user out of session
    const user = getUserByEmail(db, email)

    if (user === null || user === undefined) {

      cb(new Error('user not found'))

    } else {

      cb(null, user)

    }

  })

  passport.use('local-login', new Strategy({

    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true

  }, (req, email, password, cb) => {

    let user = null

    try {

      user = getUserByEmail(db, email)

      try {

        bcrypt.compare(encodeURIComponent(password), user.password, (err, match) => {

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

    const checkUser = getUserByEmail(db, email)

    if (checkUser !== null && checkUser !== undefined) {

      return cb(null, false, {
        error: true,
        status: 409,
        clientMessage: errorMessages.emailAlreadyExists,
        serverMessage: `Email ${email} already exists in the database.`
      })

    }

    try {

      bcrypt.hash(encodeURIComponent(password), saltRounds, (err, hash) => {

        if (err) {

          return cb(err, false, {
            error: true,
            status: 500,
            clientMessage: errorMessages.serverErrorMessage,
            serverMessage: err.stack
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
}

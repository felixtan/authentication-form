module.exports = (app, db) => {

  const encodeURIComponentEnhanced = require('../scripts/helpers').encodeURIComponentEnhanced
  const router = require('express').Router({ caseSensitive: true })
  const bcrypt = require('bcrypt')
  const saltRounds = 10

  // Login error messages
  const failedAttemptMessage = 'The email or password you entered did not match our records. Please double-check and try again.'
  const serverErrMessage = 'Internal Server Error\nPlease contact the authorities.'

  router.get('/', (req, res) => {
    app.locals.login = true
    return res.render('login', { loginErr: false })
  })

  router.post('/', (req, res) => {
    let result, storedPassword = null

    try {
      result = db.exec(`SELECT password FROM users WHERE email=${JSON.stringify(encodeURIComponent(req.body.email))} LIMIT 1`)[0]
      storedPassword = result.values[0][0]
    } catch (err) {
      app.locals.signup = true
      if (result === undefined && storedPassword === null) {
        return res.render('login', { loginErr: true, loginErrMessage: failedAttemptMessage })
      } else {
        // TODO: log this to server logs
        return res.render('login', { loginErr: true, loginErrMessage: serverErrMessage })
      }
    }

    if (result === undefined && storedPassword === null) {
      app.locals.login = true
      return res.render('login', { loginErr: true, loginErrMessage: failedAttemptMessage })
    } else {
      try {
        bcrypt.compare(encodeURIComponentEnhanced(req.body.password), storedPassword, (err, match) => {
          if (match) {
            app.locals.index = true
            return res.render('index')
          } else {
            app.locals.login = true
            return res.render('login', { loginErr: true, loginErrMessage: failedAttemptMessage })
          }
        })
      } catch (err) {
        app.locals.login = true
        // TODO: log this to server logs
        return res.render('login', { loginErr: true, loginErrMessage: serverErrMessage })
      }
    }
  })

  return router
}

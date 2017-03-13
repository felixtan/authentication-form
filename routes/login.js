module.exports = (app, db, passport, helpers) => {

  const router = require('express').Router({ caseSensitive: true })

  router.get('/', (req, res) => {

    const renderOpts = {}

    if (app.locals.errorMessage) {

      renderOpts.error = true
      renderOpts.errorMessage = app.locals.errorMessage
      delete app.locals.errorMessage

    }

    if (app.locals.passwordReset) {

      renderOpts.tip = true
      renderOpts.message = 'Your password was reset!'
      delete app.locals.passwordReset

    }

    helpers.clearPasswordRecoveryAttempt(app)

    return res.render('login', renderOpts, (err, html) => res.send(html))

  })

  router.post('/', (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {

      const renderOpts = {
        // layout: null,
        error: true,
        status: info.status,
        errorMessage: info.clientMessage
      }

      // Sever exception
      if (err) {
        return res.render('login', renderOpts, (err, html) => {
          return res.status(info.status).send(html)
        })
      }

      // Auth failure
      if (!user) {
        // return res.render('login', renderOpts)
        return res.render('login', renderOpts, (err, html) => {
          return res.status(info.status).send(html)
        })
      } else {
      // Auth success
        return req.logIn(user, err => {
          if (err) return next(err)

          return res.redirect('/')
        })
      }

    })(req, res, next)
  })

  return router
}

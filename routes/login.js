module.exports = (app, db, passport) => {

  const router = require('express').Router({ caseSensitive: true })

  router.get('/', (req, res) => {
    return res.render('login', { loginErr: false })
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

module.exports = (app, db, passport) => {

  const router = require('express').Router({ caseSensitive: true })
  const messages = require('../scripts/helpers.js').messages

  router.get('/', (req, res) => {

    return res.render('signup')

  })

  router.post('/', (req, res, next) => {

    passport.authenticate('local-signup', (err, user, info) => {

      const renderOpts = {
        error: true,
        status: info.status,
        errorMessage: info.clientMessage
      }

      // Sever exception
      if (err) {

        return res.render('signup', renderOpts, (err, html) => {
          return res.status(info.status).send(html)
        })

      }

      // Auth failure
      if (!user) {

        return res.render('signup', renderOpts, (err, html) => {
          return res.status(info.status).send(html)
        })

      } else {

        // Auth success
        return req.logIn(user, (err) => {

          if (err) {

            return res.render('signup', {

              error: true,
              status: 500,
              errorMessage: messages.serverErrorMessage,
              serverErrorMessage: 'Sign up suceeded but subsequent authentication failed.'

            }, (err, html) => {

              return res.status(500).send(html)

            })
          }

          return res.redirect('/')
        })

      }

    })(req, res, next)
  })

  return router
}

function SQLError(message) {
  this.name = 'SQLError'
  this.message = message || 'Failed to execute INSERT query on new user'
  this.stack = (new Error()).stack;
}

function EncryptionError(message) {
  this.name = 'EncryptionError'
  this.message = message || 'Encryption Error'
  this.stack = (new Error()).stack;
}

function RedirectError(message) {
  this.name = 'RedirectError'
  this.message = message || 'Redirect Error'
  this.stack = (new Error()).stack;
}

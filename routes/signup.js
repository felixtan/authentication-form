module.exports = (app, db, passport) => {

  const router = require('express').Router({ caseSensitive: true })
  const bcrypt = require('bcrypt')
  const saltRounds = 10
  const encodeURIComponentEnhanced = require('../scripts/helpers').encodeURIComponentEnhanced
  const serverErrorMessage = require('../scripts/helpers').messages.serverErrorMessage

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
          // console.log(html)
          return res.status(info.status).send(html)
        })
      } else {
        return req.logIn(user, err => {
          if (err) return next(err)

          res.render('home', renderOpts, (err, html) => {
            return res.send(html)
          })
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

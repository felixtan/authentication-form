module.exports = (app, db, passport) => {

  const router = require('express').Router({ caseSensitive: true })
  const messages = require('../../scripts/helpers.js').messages
  const nodemailer = require('../../scripts/helpers.js').nodemailer
  const createMail = require('../../scripts/helpers.js').createMail
  const getRandomString = require('../../scripts/helpers.js').getRandomString
  const getUserByEmail = require('../../scripts/helpers.js').getUserByEmail
  const renderOpts500 = require('../../scripts/helpers.js').renderOpts500

  router.get('/', (req, res) => {

    return res.render('passwordRecoveryStage1')

  })

  router.post('/', (req, res, next) => {

    if (!!app.locals.user && !!app.locals.passwordRecoveryAttempt) {

      return res.render('passwordRecoveryStage2', {

        error: true,
        status: 400,
        errorMessage: 'You have already begun the process of password recovery. Please check your email for the security code.'

      }, (err, html) => {

        return res.status(400).send(html)

      })
    }

    let user = null

    try {

      user = getUserByEmail(db, req.body.email)

      if (user === undefined || user === null) {

        return res.render('passwordRecoveryStage1', {

          error: true,
          status: 404,
          errorMessage: messages.failedAttemptMessage

        }, (err, html) => {

          return res.status(404).send(html)

        })

      } else {

        if (app.locals.passwordRecoveryAttempt === undefined) {

          app.locals.passwordRecoveryAttempt = {
            code: getRandomString(6),
            start: Date.now(),
            attempts: 0,
            showCheckEmailTip: true,
          }

        } else if (app.locals.passwordRecoveryAttempt.attempts > 0) {

            // If it already exists AND attempts >= 1
            // then the user should not be allowed to start
            // a new attempt. passwordRecoveryStage2 should
            // check app.locals for an attempt
            return res.redirect('/password-recovery/stage2')

        } else if (app.locals.passwordRecoveryAttempt.attempts === 0) {

          // If it already exists AND attempts === 0 then
          // this is a "Resend code" request. Set a new code
          // and reset the timer.
          app.locals.passwordRecoveryAttempt.code = getRandomString(6)
          app.locals.passwordRecoveryAttempt.start = Date.now()

        }

        try {

          const mail = createMail(decodeURIComponent(user.email), decodeURIComponent(user.name), app.locals.passwordRecoveryAttempt.code)

          nodemailer.sendMail(mail, (err, info) => {

            if (err) {

              console.error(err)

              return res.render('passwordRecoveryStage1', renderOpts500(), (err, html) => {
                return res.status(500).send(html)
              })

            }

            delete user.password
            app.locals.user = user
            return res.redirect('/password-recovery/stage2')

          })

        } catch (err) {

          console.error(err)

          // TODO: Specify that this an error with nodemailer
          return res.render('passwordRecoveryStage1', renderOpts500(), (err, html) => {
            return res.status(500).send(html)
          })

        }
      }

    } catch (err) {

      console.error(err)

      // TODO: Specify that this a database error
      return res.render('passwordRecoveryStage1', renderOpts500(), (err, html) => {
        return res.status(500).send(html)
      })
    }
  })

  return router
}

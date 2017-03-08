module.exports = (app, db, passport, helpers) => {

  const router = require('express').Router({ caseSensitive: true })
  const nodemailer = helpers.nodemailer
  const getRandomString = helpers.getRandomString
  const renderOpts500 = helpers.renderOpts500
  const createMail = helpers.createMail
  const clearPasswordRecoveryAttempt = helpers.clearPasswordRecoveryAttempt

  router.get('/', (req, res) => {

    if (app.locals.passwordRecoveryAttempt === undefined || app.locals.user === undefined) {

      // User did not enter email at stage 1
      // They shouldn't be here
      return res.redirect('/password-recovery/stage1')

    } else {

      if (!!app.locals.passwordRecoveryAttempt.badResendCodeRequest) {

        const renderOpts = {
          error: true,
          status: 400,
          errorMessage: 'You have already begun the process of password recovery. Please check your email for the security code.'
        }

        return res.render('passwordRecoveryStage2', renderOpts, (err, html) => {

          delete app.locals.passwordRecoveryAttempt.badResendCodeRequest
          return res.status(400).send(html)

        })

      } else if (!app.locals.passwordRecoveryAttempt.attempts && app.locals.passwordRecoveryAttempt.showCheckEmailTip) {

        const renderOpts = {
          tip: !app.locals.passwordRecoveryAttempt.attempts,
          error: false,
          status: 200,
          message: 'Please check your email for the security code.'
        }

        return res.render('passwordRecoveryStage2', renderOpts, (err, html) => res.send(html))

      } else {

        return res.render('passwordRecoveryStage2')

      }

    }

  })

  router.post('/', (req, res) => {

    const TWENTY_MINUTES_IN_MS = 1000*60*20

    if (Date.now() - app.locals.passwordRecoveryAttempt.start >= TWENTY_MINUTES_IN_MS) {

      clearPasswordRecoveryAttempt(app)

      // Invalidate the security code
      const renderOpts = {
        error: true,
        status: 400,
        errorMessage: 'The security code has expired. Please restart the password recovery process.'
      }

      return res.render('passwordRecoveryStage1', renderOpts, (err, html) => res.status(400).send(html))

    }

    // Validate the code
    if (req.body.code === app.locals.passwordRecoveryAttempt.code) {

      app.locals.passwordRecoveryAttempt.codeValidated = true
      return res.redirect('/password-recovery/stage3')

    } else {

      app.locals.passwordRecoveryAttempt.attempts++

      const renderOpts = {
        error: true,
        status: 401,
        errorMessage: 'Incorrect security code.'
      }

      if (app.locals.passwordRecoveryAttempt.attempts === 3) {

        // TODO: Lock the account

        clearPasswordRecoveryAttempt(app)

        renderOpts.errorMessage = 'You have entered an incorrect security code 3 times. Due to security concerns, your account has been locked. Please contact the site administrator.'

        return res.render('login', renderOpts, (err, html) => res.status(401).send(html))

      } else {

        return res.render('passwordRecoveryStage2', renderOpts, (err, html) => res.status(401).send(html))

      }

    }
  })

  router.post('/resend-code', (req, res) => {

    if (app.locals.user === undefined || app.locals.passwordRecoveryAttempt === undefined) {

      return res.redirect('/password-recovery/stage1')

    } else if (!!app.locals.user && !!app.locals.passwordRecoveryAttempt && !app.locals.passwordRecoveryAttempt.attempts) {

      app.locals.passwordRecoveryAttempt = {
        code: getRandomString(6),
        start: Date.now(),
        attempts: 0,
        showCheckEmailTip: true,
      }

      try {

        const mail = createMail(decodeURIComponent(app.locals.user.email), decodeURIComponent(app.locals.user.name), app.locals.passwordRecoveryAttempt.code)

        nodemailer.sendMail(mail, (err, info) => {

          if (err) {

            console.error(err)

            return res.render('passwordRecoveryStage2', renderOpts500(), (err, html) => res.status(500).send(html))

          }

          return res.redirect('/password-recovery/stage2')

        })

      } catch (err) {

        console.error(err)
        // TODO: specify it's an error with nodemailer
        return res.render('passwordRecoveryStage2', renderOpts500(), (err, html) => res.status(500).send(html))

      }

    } else {

      if (app.locals.passwordRecoveryAttempt.attempts) {

        app.locals.passwordRecoveryAttempt.badResendCodeRequest = true
        return res.redirect('/password-recovery/stage2')

      } else {

        // This shouldn't be possible.
        // User and pw recovery state should be set in app.locals
        return res.render('passwordRecoveryStage2', renderOpts500(), (err, html) => res.status(500).send(html))

      }

    }

  })

  router.post('/hide-check-email-tip', (req, res) => {

    app.locals.passwordRecoveryAttempt.showCheckEmailTip = false
    return res.redirect('/password-recovery/stage2')

  })

  return router
}

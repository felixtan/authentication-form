module.exports = (app, db, passport) => {

  const router = require('express').Router({ caseSensitive: true })
  const bcrypt = require('bcrypt')
  const saltRounds = 10
  const getUserByEmail = require('../../scripts/helpers.js').getUserByEmail
  const clearPasswordRecoveryAttempt = require('../../scripts/helpers.js').clearPasswordRecoveryAttempt

  router.get('/', (req, res) => {

    if (app.locals.passwordRecoveryAttempt === undefined || app.locals.user === undefined) {

      // User did not enter email at stage 1
      // They shouldn't be here
      return res.redirect('/password-recovery/stage1')

    } else if (app.locals.passwordRecoveryAttempt !== undefined && app.locals.user !== undefined) {

      if (!app.locals.passwordRecoveryAttempt.codeValidated) {

        return res.redirect('/password-recovery/stage2')

      } else {

        return res.render('passwordRecoveryStage3')

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

    } else {

      const encodedPassword = encodeURIComponent(req.body.password)

      if (encodedPassword !== encodeURIComponent(req.body.repeatPassword)) {
        // This should not happen
        const renderOpts = {
          error: true,
          status: 500,
          errorMessage: 'The passwords did not match.',
          serverMessage: 'Passwords do not match despite frontend validation.'
        }
        // console.log('passwords dont match')
        return res.render('passwordRecoveryStage3', renderOpts, (err, html) => res.status(500).send(html))

      } else {

        try {

          bcrypt.hash(encodedPassword, saltRounds, (err, hash) => {

            if (err) {

              const renderOpts = {
                error: true,
                status: 500,
                errorMessage: 'Sorry, something went wrong. Please contact the site administrator.',
                serverMessage: 'Error with bcrypt password hashing.'
              }
              // console.log(err)
              return res.render('passwordRecoveryStage3', renderOpts, (err, html) => res.status(500).send(html))

            } else {

              try {
                // get the user, update hashed pw, save, redirect to login
                const updateStatement = db.prepare('UPDATE users SET password = :newPassword WHERE email = :email;')
                updateStatement.bind({ ':email': app.locals.user.email, ':newPassword': hash })
                updateStatement.step()
                app.locals.passwordReset = true
                clearPasswordRecoveryAttempt(app)

                return res.redirect('/login')

              } catch (err) {

                const renderOpts = {
                  error: true,
                  status: 500,
                  errorMessage: 'Sorry, something went wrong. Please contact the site administrator.',
                  serverMessage: err.stack,
                }
                // console.log(err)
                return res.render('passwordRecoveryStage3', renderOpts, (err, html) => res.status(500).send(html))

              }

            }

          })

        } catch (err) {

          const renderOpts = {
            error: true,
            status: 500,
            errorMessage: 'Sorry, something went wrong. Please contact the site administrator.',
            serverMessage: err.stack,
          }
          // console.log(err)
          return res.render('passwordRecoveryStage3', renderOpts, (err, html) => res.status(500).send(html))

        }
      }
    }
  })

  return router

}

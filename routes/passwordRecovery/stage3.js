module.exports = (app, db, passport) => {

  const router = require('express').Router({ caseSensitive: true })

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

  })

  return router
}

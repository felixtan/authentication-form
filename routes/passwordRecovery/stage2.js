module.exports = (app, db, passport) => {
  const router = require('express').Router({ caseSensitive: true })

  router.get('/', (req, res) => {

    if (app.locals.passwordRecoveryAttempt === undefined || app.locals.userEmail === undefined) {

      // User did not enter email at stage 1
      // They shouldn't be here
      return res.redirect('/password-recovery/stage1')

    } else {

      return res.render('passwordRecoveryStage2')

    }

  })

  return router
}

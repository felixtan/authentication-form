module.exports = (app, db) => {
  const router = require('express').Router({ caseSensitive: true })

  router.get('/', (req, res) => {
    app.locals.forgotpw = true
    res.render('forgotpw')
  })

  return router
}

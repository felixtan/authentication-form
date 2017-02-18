module.exports = (app) => {

  const router = require('express').Router({ caseSensitive: true })

  router.get('/', (req, res) => {
    app.locals.index = true
    return res.render('index')
  })

  return router
}

module.exports = (app, db, passport) => {

  const router = require('express').Router({ caseSensitive: true })

  router.get('/', (req, res) => {

    res.render('pageNotFound', (err, html) => {

      res.status(400).send(html)

    })

  })

  return router
}

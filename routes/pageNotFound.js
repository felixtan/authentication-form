module.exports = (app, db, passport) => {

  const router = require('express').Router({ caseSensitive: true })

  router.get('/page-not-found', (req, res) => {

    res.render('pageNotFound', (err, html) => {

      res.status(404).send(html)

    })

  })

  return router
}

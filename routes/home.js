module.exports = (app, db, passport, helpers) => {

  const router = require('express').Router({ caseSensitive: true })
  const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn

  router.get('/', ensureLoggedIn('/login'), (req, res) => {

    res.render('home')

  })

  return router
}

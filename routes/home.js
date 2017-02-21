module.exports = (app, db, passport) => {

  const router = require('express').Router({ caseSensitive: true })
  const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn

  // ensureLoggedIn('/login'),
  router.get('/', ensureLoggedIn(), (req, res) => {
    res.render('home')
  })

  return router
}

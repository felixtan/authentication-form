module.exports = (app, db, passport, helpers) => {

  const router = require('express').Router({ caseSensitive: true })

  router.get('/', (req, res) => {

    req.logout()
    res.redirect('/login')
    
  })

  return router
}

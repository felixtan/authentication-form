module.exports = (app, db) => {

  const encodeURIComponentEnhanced = require('../scripts/helpers').encodeURIComponentEnhanced
  const router = require('express').Router({ caseSensitive: true })
  const bcrypt = require('bcrypt')

  // db
  const insertUserStatement = db.prepare('INSERT INTO users VALUES (:name, :company, :email, :password);')

  router.get('/', (req, res) => {
    app.locals.signup = true
    return res.render('signup')
  })

  router.post('/', (req, res) => {
    try {
      bcrypt.hash(encodeURIComponentEnhanced(req.body.password), saltRounds, (err, hash) => {
        if (err) throw err

        insertUserStatement.bind({
          ':name': encodeURIComponent(req.body.fullName),
          ':company': encodeURIComponent(req.body.companyName),
          ':email': encodeURIComponent(req.body.email),
          ':password': hash
        })
        insertUserStatement.step()

        app.locals.index = true
        return res.render('index')
      })
    } catch (err) {
      app.locals.signup = true
      return res.render('signup', { signupErr: true, signupErrMsg: serverErrMessage })
    }
  })

  return router
}

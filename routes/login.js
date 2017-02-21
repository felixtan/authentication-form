module.exports = (app, db, passport) => {

  const encodeURIComponentEnhanced = require('../scripts/helpers').encodeURIComponentEnhanced
  const router = require('express').Router({ caseSensitive: true })
  const bcrypt = require('bcrypt')

  // Login error messages
  const failedAttemptMessage = require('../scripts/helpers').messages.failedAttemptMessage
  const serverErrorMessage = require('../scripts/helpers').messages.serverErrorMessage

  router.get('/', (req, res) => {
    return res.render('login', { loginErr: false })
  })

  router.post('/', (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {

      const renderOpts = {
        // layout: null,
        error: true,
        status: info.status,
        errorMessage: info.clientMessage
      }

      // Sever exception
      if (err) {
        return res.render('login', renderOpts, (err, html) => {
          return res.status(info.status).send(html)
        })
      }

      // Auth failure
      if (!user) {
        return res.render('login', renderOpts, (err, html) => {
          // console.log(html)
          return res.status(info.status).send(html)
        })
      } else {
        return req.logIn(user, err => {
          if (err) return next(err)

          res.render('home', renderOpts, (err, html) => {
            return res.send(html)
          })
        })
      }

    })(req, res, next)
  })




  // router.post('/', (req, res) => {
  //   let result, storedPassword = null
  //
  //   try {
  //     result = db.exec(`SELECT * FROM users WHERE email=${JSON.stringify(encodeURIComponent(req.body.email))} LIMIT 1`)[0]
  //     /*
  //       Example
  //       { columns: [ 'name', 'company', 'email', 'password' ],
  // values:
  //  [ [ 'Felix%20Tan',
  //      'dwadwadwa',
  //      'tanf91%40gmail.com',
  //      '$2a$10$zIjc/r3Y1nUi90gc28uCX.55h/Osjq7BNjfq0kqvsNvx8ifTv0Q0K' ] ] }
  //     */
  //     storedPassword = result.values[0][result.columns.indexOf('password')]
  //
  //     try {
  //       bcrypt.compare(encodeURIComponentEnhanced(req.body.password), storedPassword, (err, match) => {
  //         if (match) {
  //           return res.render('home', (err, html) => {
  //             console.log(req.user)
  //             return res.status(200).send(html)
  //           })
  //         } else {
  //           return res.render('login', { layout: null, loginErr: true, loginErrorMessage: failedAttemptMessage }, (err, html) => {
  //             return res.status(401).send(html)
  //           })
  //         }
  //       })
  //     } catch (err) {
  //       return res.render('login', { layout: null, loginErr: true, loginErrorMessage: serverErrorMessage }, (err, html) => {
  //         // TODO: log this
  //         return res.status(500).send(html)
  //       })
  //     }
  //   } catch (err) {
  //     if (result === null || result === undefined) {
  //       return res.render('login', { layout: null, loginErr: true, loginErrorMessage: failedAttemptMessage }, (err, html) => {
  //         // TODO: log this
  //         return res.status(401).send(html)
  //       })
  //     } else {
  //       return res.render('login', { layout: null, loginErr: true, loginErrorMessage: serverErrorMessage }, (err, html) => {
  //         // TODO: log this
  //         return res.status(500).send(html)
  //       })
  //     }
  //   }
  // })

  return router
}

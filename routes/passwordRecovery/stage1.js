module.exports = (app, db, passport) => {

  const router = require('express').Router({ caseSensitive: true })
  const nodemailer = require('nodemailer')
  const messages = require('../../scripts/helpers.js').messages
  const getUserByEmail = require('../../scripts/helpers.js').getUserByEmail
  const emailIsEncoded = require('../../scripts/helpers.js').emailIsEncoded

  const myEmail = 'authportal64@gmail.com'
  const myPass = 'steamisgay1'
  const myName = 'Jesus'

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: myEmail,
      pass: myPass
    }
  })

  router.get('/', (req, res) => {

    return res.render('passwordRecoveryStage1')

  })


  router.post('/', (req, res, next) => {

    let user = null

    try {

      user = getUserByEmail(db, req.body.email)

      if (user === undefined || user === null) {

        res.render('passwordRecoveryStage1', {

          error: true,
          status: 404,
          errorMessage: messages.failedAttemptMessage

        }, (err, html) => {

          return res.status(404).send(html)

        })

      } else {

        if (app.locals.passwordRecoveryAttempt === undefined) {

          app.locals.passwordRecoveryAttempt = {
            code: getRandomString(6),
            start: (new Date()).getTime(),
            attempts: 0
          }

        } else if (app.locals.passwordRecoveryAttempt.attempts > 0) {

            // If it already exists AND attempts >= 1
            // then the user should not be allowed to start
            // a new attempt. passwordRecoveryStage2 should
            // check app.locals for an attempt
            return res.redirect('/password-recovery/stage2')

        } else if (app.locals.passwordRecoveryAttempt.attempts === 0) {

          // If it already exists AND attempts === 0 then
          // this is a "Resend code" request. Set a new code
          // and reset the timer.
          app.locals.passwordRecoveryAttempt.code = getRandomString(6)
          app.locals.passwordRecoveryAttempt.start = (new Date()).getTime()

        }

        try {

          const userEmail = emailIsEncoded(user.email) ? decodeURIComponent(user.email) : user.email

          transporter.sendMail(createMail(userEmail, decodeURIComponent(user.name), app.locals.passwordRecoveryAttempt.code), (err, info) => {

            if (err) {

              console.error(err)

              return res.render('passwordRecoveryStage1', renderOpts500(), (err, html) => {
                return res.status(500).send(html)
              })

            }

            app.locals.userEmail = user.email
            return res.redirect('/password-recovery/stage2')

          })

        } catch (err) {

          console.error(err)

          // TODO: Specify that this an error with nodemailer
          return res.render('passwordRecoveryStage1', renderOpts500(), (err, html) => {
            return res.status(500).send(html)
          })

        }
      }

    } catch (err) {

      console.error(err)

      // TODO: Specify that this a database error
      return res.render('passwordRecoveryStage1', renderOpts500(), (err, html) => {
        return res.status(500).send(html)
      })
    }
  })

  /**
   * Returns boilerplate error 500 render options
   */
  function renderOpts500() {
    return {
      error: true,
      status: 500,
      errorMessage: messages.serverErrorMessage
    }
  }

  /**
   *  Generates array of integers from start to end inclusive i.e. [start...end]
   */
  function range(start, end) {

    start = parseInt(start)
    end = parseInt(end)

    if (isNaN(start)) {
      throw new TypeError('argument start is not a number')
    }

    if (isNaN(end)) {
      throw new TypeError('argument end is not a number')
    }

    return [...Array(end-start+1).keys()].map(i => start + i)
  }

  /*
  * Decimal codes of digits and uppercase letters
  */
  const characterSet = range(48, 57).concat(range(65, 90))

  /**
   * Get random in in [min, ..., max)
   */
  function getRandomInt(min, max) {

    if (min !== undefined && max === undefined) {
      max = min
      min = 0
    }

    min = parseInt(min)
    max = parseInt(max)

    if (isNaN(min)) {
      throw new TypeError('argument min is not a number')
    }

    if (isNaN(max)) {
      throw new TypeError('argument max is not a number')
    }

    return Math.floor(Math.random() * (max - min)) + min
  }

  /**
   * Shuffles array in place. ES6 version
   * @param {Array} a items The array containing the items.
   */
  function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
  }

  /*
   * Generates random code sent to email submitted to password recovery form
   */
  function getRandomString(length) {

    length = parseInt(length)

    if (isNaN(length)) {
      throw new TypeError('argument length is not a number')
    }

    let result = ''

    shuffle(characterSet)

    for (let i = 0; i < length; i++) {
      result += String.fromCharCode(characterSet[getRandomInt(0, characterSet.length)])
    }

    return result
  }

  /**
   * Password recovery email template
   */
  function createMail(userEmail, userFullName, tempCode) {
    return {
      from: myEmail,
      to: userEmail,
      subject: 'Reset your password',
      html: `
        <p>Dear ${userFullName},</p>
        <br>
        <p>For security reasons, we're unable to send your original password via email.</p>
        <br>
        <p>Please enter this code in the form to reset your password:</p>
        <p><b>${tempCode}</b></p>
        <p><b>Please note that the code will expire in 20 minutes.</b></p>
        <br>
        <p>Thanks for being a member.</p>
        <br>
        <p>Sincerely,</p>
        <p>${myName}</p>
      `
    }
  }

  return router
}

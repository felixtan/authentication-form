const serverErrorMessage = 'Internal Server Error. Please contact the authorities.'
const failedAttemptMessage = 'The email or password you entered did not match our records. Please double-check and try again.'
const emailAlreadyExists = 'That email already exists in the database. Please use a different email or try recovering your password.'

/*
 * Decimal codes of digits and uppercase letters
 *
 * Used for generating security code for password recovery
 */
const characterSet = range(48, 57).concat(range(65, 90))

/**
 * Nodemailer config
 */
const myEmail = 'authportal64@gmail.com'
const myPass = 'steamisgay1'
const myName = 'Jesus'
const nodemailer = require('nodemailer').createTransport({
  service: 'gmail',
  auth: {
    user: myEmail,
    pass: myPass
  }
})

module.exports = {

  // general
  emailIsEncoded,

  // password recovery
  createMail,
  clearPasswordRecoveryAttempt,
  getRandomString,
  nodemailer,

  // db helpers
  getUserByEmail,
  createUser,

  // render options
  renderOpts500,

  messages: {
    serverErrorMessage,
    failedAttemptMessage,
    emailAlreadyExists,
  }
}

/**
 * Extend encodeURIComponent to encode "(" and ")"
 */
function encodeURIComponentEnhanced(input) {
  return encodeURIComponent(input)
          .replace(/\(/g, '%28')
          .replace(/\)/g, '%29')
}

/**
 * Retrieve user from sqlite instance by email
 *
 * @param {Object} db - app's sql.js sqlite3 instance
 * @param {String} email - user's email, decoded
 */
function getUserByEmail(db, email) {
  email = emailIsEncoded(email) ? email : encodeURIComponent(email)
  const statement = db.prepare('SELECT * FROM users WHERE email = :encodedEmail LIMIT 1')
  statement.bind({ ':encodedEmail': email })
  statement.step()
  return statement.getAsObject()
}

function createUser(db, user) {

  const insertUserStatement = db.prepare('INSERT INTO users VALUES (:name, :company, :email, :password);')

  insertUserStatement.bind({
    ':name': user.name,
    ':company': user.company,
    ':email': user.email,
    ':password': user.passwordHash
  })

  insertUserStatement.step()
}

/**
 * Checks whether an email string is encoded using
 * encodeURIComponent.
 *
 * Assume that email is already sanitized
 */
function emailIsEncoded(email) {
  return email.indexOf('@') === -1
}

/**
 * Returns boilerplate error 500 render options
 */
function renderOpts500() {
  return {
    error: true,
    status: 500,
    errorMessage: serverErrorMessage
  }
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
      <p>Dear ${userFullName},</p><br>

      <p>For security reasons, we're unable to send your original password via email.</p><br>

      <p>Please enter this code in the form to reset your password:</p>
      <p><b>${tempCode}</b></p><br>

      <p><b>Please note that the code will expire in 20 minutes.</b></p><br>

      <p>Thanks for being a member.</p><br>

      <p>Sincerely,</p>
      <p>${myName}</p>
    `
  }
}

/**
 * Delete user information from app.locals after exiting password recovery
 */
function clearPasswordRecoveryAttempt(app) {
  delete app.locals.passwordRecoveryAttempt
  delete app.locals.user
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
 * Shuffles array in place. ES6 version
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
  for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
}

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

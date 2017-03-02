const serverErrorMessage = 'Internal Server Error. Please contact the authorities.'
const failedAttemptMessage = 'The email or password you entered did not match our records. Please double-check and try again.'
const emailAlreadyExists = 'That email already exists in the database. Please use a different email or try recovering your password.'

module.exports = {
  encodeURIComponentEnhanced,
  emailIsEncoded,

  // db helpers
  prettifyUserFromDb,
  getUserByEmail,

  messages: {
    serverErrorMessage,
    failedAttemptMessage,
    emailAlreadyExists
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
 * Returns user's data in key/value pair form
 *
 * @param {Object} userFromDb - object returned from sql.js exec query
 */

function prettifyUserFromDb(userFromDb) {

  if (userFromDb === null || userFromDb === undefined) return userFromDb

  const data = {}

  userFromDb.columns.forEach((field, index) => {
    data[field] = userFromDb.values[0][index]
  })

  return data
}

/**
 * Retrieve user from sqlite instance by email
 *
 * @param {Object} db - app's sql.js sqlite3 instance
 * @param {String} email - user's email, decoded
 */
function getUserByEmail(db, email) {
  email = emailIsEncoded(email) ? email : encodeURIComponent(email)
  return prettifyUserFromDb(db.exec(`SELECT * FROM users WHERE email=${JSON.stringify(email)} LIMIT 1`)[0])
}

function createUser(db, data) {

  insertUserStatement = db.prepare('INSERT INTO users VALUES (:name, :company, :email, :password);')

  insertUserStatement.bind({
    ':name': user.name,
    ':company': user.company,
    ':email': user.email,
    ':password': user.hash
  })

  console.log(insertUserStatement.step())
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

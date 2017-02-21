const serverErrorMessage = 'Internal Server Error. Please contact the authorities.'
const failedAttemptMessage = 'The email or password you entered did not match our records. Please double-check and try again.'
const emailAlreadyExists = 'That email already exists in the database. Please use a different email or try recovering your password.'

module.exports = {
  encodeURIComponentEnhanced,
  messages: {
    serverErrorMessage,
    failedAttemptMessage,
    emailAlreadyExists
  }
}

// extend encodeURIComponent to encode "(" and ")"
function encodeURIComponentEnhanced(input) {
  return encodeURIComponent(input)
          .replace(/\(/g, '%28')
          .replace(/\)/g, '%29')
}

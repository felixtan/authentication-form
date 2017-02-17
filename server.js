const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const sql = require('sql.js')
const bcrypt = require('bcrypt')
const hbs = require('express-hbs')

// Crypto
const saltRounds = 10

// Database
const db = new sql.Database()
db.run('CREATE TABLE users (name char, company char, email char, password char);')
const insertUserStatement = db.prepare('INSERT INTO users VALUES (:name, :company, :email, :password);')

// Express
const app = express()
const PORT = 3000

// Messages
const failedAttemptMessage = 'The email or password you entered did not match our records. Please double-check and try again.'
const serverErrMessage = 'Internal Server Error\nPlease contact the authorities.'

// Templating
app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views/partials',
  defaultLayout: __dirname + '/views/template.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// Middleware
app.use(express.static(__dirname + '/'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(printRequestMiddleware)

app.get('/', (req, res) => {
  return res.render('index')
})

app.get('/login', (req, res) => {
  return res.render('login', { loginErr: false })
})

app.post('/login', (req, res) => {

  let result, storedPassword = null

  try {
    result = db.exec(`SELECT password FROM users WHERE email=${JSON.stringify(encodeURIComponent(req.body.email))} LIMIT 1`)[0]
    storedPassword = result.values[0][0]
  } catch (err) {
    if (result === undefined && storedPassword === null) {
      return res.render('login', { loginErr: true, loginErrMessage: failedAttemptMessage }, (err, html) => {
        res.cookie('showLoginErrMsg', true)
        console.log('called')
        res.send(html)
      })
    } else {
      // TODO: log this to server logs
      return res.render('login', { loginErr: true, loginErrMessage: serverErrMessage })
    }
  }

  if (result === undefined && storedPassword === null) {
    return res.render('login', { loginErr: true, loginErrMessage: failedAttemptMessage })
  } else {
    try {
      bcrypt.compare(encodeURIComponentEnhanced(req.body.password), storedPassword, (err, match) => {
        if (match) {
          return res.render('index')
        } else {
          return res.render('login', { loginErr: true, loginErrMessage: failedAttemptMessage })
        }
      })
    } catch (err) {
      // TODO: log this to server logs
      return res.render('login', { loginErr: true, loginErrMessage: serverErrMessage })
    }
  }
})

app.get('/signup', (req, res) => {
  return res.render('signup')
})

app.post('/signup', (req, res) => {

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

      return res.render('index')
    })
  } catch (err) {
    return res.render('signup', { signupErr: true, signupErrMsg: serverErrMessage })
  }
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT} in development mode.`)
})

function printRequestMiddleware(req, res, next) {
  console.log(`\nHeaders:\n${JSON.stringify(req.headers, null, 4)}\n\nBody:\n${JSON.stringify(req.body, null, 4)}`)
  next()
}

// extend encodeURIComponent to encode "(" and ")"
function encodeURIComponentEnhanced(input) {
  return encodeURIComponent(input)
          .replace(/\(/g, '%28')
          .replace(/\)/g, '%29')
}

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const sql = require('sql.js')
const bcrypt = require('bcrypt')

// Crypto
const saltRounds = 10

// Database
const db = new sql.Database()
db.run('CREATE TABLE users (name char, company char, email char, password char);')
const insertUserStatement = db.prepare('INSERT INTO users VALUES (:name, :company, :email, :password);')

const app = express()
const PORT = 3000

app.use(express.static(__dirname + '/'))
app.use(sendViewMiddleware)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(printRequest)

app.get('/', (req, res) => {
  res.sendView('index.html')
})

app.get('/login', (req, res) => {
  res.sendView('login.html')
})

app.post('/login', (req, res) => {
  // res.sendView('login.html')

  try {
      const result = db.exec(`SELECT password FROM users WHERE email=${JSON.stringify(encodeURIComponent(req.body.email))} LIMIT 1`)[0]
      const storedPassword = result.values[0][0]

      bcrypt.compare(encodeURIComponentEnhanced(req.body.password), storedPassword, (err, match) => {
        if (match) {
          res.sendView('index.html')
        } else {
            // TODO: pass "bad login attempt" param into route
            // It will show a warning message
            // res.sendView('login.html')

            res.send(`
              <!doctype html>
              <html>
              <head>
                <title>Awesome Auth Portal</title>
                  <link href="./style.css" rel='stylesheet' />
                </head>
                <body>
                  <a href='/login'>Back to Login</a>
                  <a href='/signup'>Back to Sign Up</a>

                  <div>
                    <p style='color:red;'>Bad Login!</p>
                    <p>stored: ${storedPassword}</p>
                    <p>given: ${JSON.stringify(req.body.password)}</p>
                  </div>
                </body>
              </html>
            `)
        }
      })
  } catch (err) {
    res.status(500).send(`
      <!doctype html>
      <html>
      <head>
        <title>Awesome Auth Portal</title>
          <link href="./style.css" rel='stylesheet' />
        </head>
        <body>
          <a href='/login'>Back to Login</a>
          <a href='/signup'>Back to Sign Up</a>

          <div>
            <h2>Error: 500</h2>
            <p>${err}</p>
          </div>
        </body>
      </html>
      `)
  }
})

app.get('/signup', (req, res) => {
  res.sendView('signup.html')
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

      const data = db.exec('SELECT * FROM users')
      console.log(`\nData:\n${JSON.stringify(data, null, 4)}`)

      res.send(`
        <!doctype html>
        <html>
        <head>
          <title>Awesome Auth Portal</title>
            <link href="./style.css" rel='stylesheet' />
          </head>
          <body>
            <div style='display:flex; justify-content:space-between; align-items:center;'>
              <a href='/signup'>Back to Signup</a>
              <a href='/login'>Login</a>
            </div>

            <div>
              <h4>Body:</h4>
              <p>${JSON.stringify(data)}</p>

              <!--<p>"\\u003Cscript\\u003Ealert('You have an XSS vulnerability!')\\u003C\\u002Fscript\\u003E"</p>-->
            </div>
          </body>
        </html>
      `)
    })
  } catch (err) {
    res.status(500).send(`Error 500: ${err}`)
  }
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT} in development mode.`)
})

function sendViewMiddleware(req, res, next) {
  res.sendView = (view) => res.sendFile(`${__dirname}/${view}`)
  next()
}

function printRequest(req, res, next) {
  console.log(`\nHeaders:\n${JSON.stringify(req.headers, null, 4)}\n\nBody:\n${JSON.stringify(req.body, null, 4)}`)
  next()
}

// extend encodeURIComponent to encode "(" and ")"
function encodeURIComponentEnhanced(input) {
  return encodeURIComponent(input)
          .replace(/\(/g, '%28')
          .replace(/\)/g, '%29')
}

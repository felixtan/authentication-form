const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')

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

  res.send(`
    <!doctype html>
    <html>
    <head>
      <title>Awesome Auth Portal</title>
        <link href="./style.css" rel='stylesheet' />
      </head>
      <body>
        <a href='/login'>Back to Login</a>
        <div>
          <h4>Body:</h4>
          <p>${JSON.stringify(req.body, null, 4)}</p>
        </div>
      </body>
    </html>
  `)
})

app.get('/signup', (req, res) => {
  res.sendView('signup.html')
})

app.post('/signup', (req, res) => {

  // res.sendView('signup.html')

  res.send(`
    <!doctype html>
    <html>
    <head>
      <title>Awesome Auth Portal</title>
        <link href="./style.css" rel='stylesheet' />
      </head>
      <body>
        <a href='/signup'>Back to Signup</a>

        <div>
          <h4>Body:</h4>
          <p>${JSON.stringify(req.body, null, 4)}</p>

          <!--<p>"\\u003Cscript\\u003Ealert('You have an XSS vulnerability!')\\u003C\\u002Fscript\\u003E"</p>-->
        </div>
      </body>
    </html>
  `)
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

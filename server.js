const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const sql = require('sql.js')
const hbs = require('express-hbs')

// Database
const db = new sql.Database()
db.run('CREATE TABLE users (name char, company char, email char, password char);')

// Express
const app = express()
const PORT = 3000

// Routes
const signup = require('./routes/signup.js')(app, db)
const login = require('./routes/login.js')(app, db)
const home = require('./routes/home.js')(app)

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

app.use('/', home)
app.use('/signup', signup)
app.use('/login', login)

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

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const sql = require('sql.js')
const hbs = require('express-hbs')
const encodeURIComponentEnhanced = require('./scripts/helpers').encodeURIComponentEnhanced

// Database
const db = new sql.Database()
db.run('CREATE TABLE users (name char, company char, email char, password char);')

// Express
const app = express()
const PORT = 3000

// Templating
app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views/partials',
  defaultLayout: __dirname + '/views/index.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// Middleware
const passport = require('./scripts/auth.js')(db)
app.use(express.static(__dirname + '/'))
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(printRequestMiddleware)
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

// Routes
const routers = require('./routes/index.js')(app, db, passport)
app.use('/', routers.home)
app.use('/signup', routers.signup)
app.use('/login', routers.login)
app.use('/forgotpw', routers.forgotpw)

app.listen(PORT)

function printRequestMiddleware(req, res, next) {
  console.log(`\nHeaders:\n${JSON.stringify(req.headers, null, 4)}\n\nBody:\n${JSON.stringify(req.body, null, 4)}`)
  next()
}

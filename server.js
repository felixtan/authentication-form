const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const PORT = 3000

app.use(express.static(__dirname + '/'))
app.use(sendViewMiddleware)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.sendView('index.html')
})

app.get('/login', (req, res) => {
  res.sendView('login.html')
})

app.post('/login', (req, res) => {
  res.sendView('login.html')
})

app.get('/signup', (req, res) => {
  res.sendView('signup.html')
})

app.post('/signup', (req, res) => {

  res.sendView('signup.html')

  // res.send(`
  //   <!doctype html>
  //   <html>
  //   <head>
  //     <title>Awesome Auth Portal</title>
  //       <link href="./style.css" rel='stylesheet' />
  //     </head>
  //     <body>
  //       ${JSON.stringify(req.body)}
  //       ${"foo</script><script>alert('You have an XSS vulnerability!')</script>"}
  //     </body>
  //   </html>
  // `)
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT} in development mode.`)
})

function sendViewMiddleware(req, res, next) {
  res.sendView = (view) => res.sendFile(`${__dirname}/${view}`)
  next()
}

const express = require('express')

const app = express()

app.use(express.static('./'))

app.get('/', (req, res) => {
  res.sendFile('index.html')
  // res.sendFile('google.html')
})

app.listen(3000, () => {
  console.log('Listening on port 3000 in development mode.')
})

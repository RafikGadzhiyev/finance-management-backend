const express = require('express')

const app = express()

const {
  PORT
} = require('./server/configs/environment')

app.get('/', (req, res) => {
  return res.send('Hello, world!')
})

app.listen(
  PORT,
  () => {
    console.log(`Server is running on ${PORT} port`)
  }
)
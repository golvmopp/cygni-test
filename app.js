const express = require('express')
const path = require('path')

const index = require('./routes/index')
const artist = require('./routes/artist')

const app = express()

// Display a basic index, maybe with link to documentation
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.use('/', index)
app.use('/artist', artist)


app.listen(3000)

module.exports = app

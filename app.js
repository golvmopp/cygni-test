const express = require('express');
const path = require('path');
const artist = require('./routes/artist');

const app = express();
const PORT = 3000;

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// Use artist routing
app.use('/artist', artist);

app.listen(PORT);

module.exports = app;

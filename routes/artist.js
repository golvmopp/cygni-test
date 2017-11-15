

/*
  Artist router. Routes GET calls to specific artist MBID's
  to return the correct JSON.
*/

const Artist = require('../models/artist.js');
const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/../index.html'));
});

// When an ID is supplied, the action starts
router.get('/:id', function(req, res) {
  // Initialize an artist with the ID
  var artist = new Artist(req.params.id);
  // Run fillArtist
  artist.fillArtist(artist).then((result) => {
    // When the promise is fulfilled, stringify the artist and send it
    // to the browser.
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(artist));
    console.log("Sent " + artist.name);
  }, (err) => {
    console.error("There was an error with fillArtist");
  })
});

module.exports = router;

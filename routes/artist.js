

/*
  Artist router. Routes GET calls to specific artist MBID's
  to return the correct JSON.
*/

const Artist = require('../models/artist.js');
const express = require('express');
const router = express.Router();

// Should not do anything. Maybe explain to the user how they're doing
// it wrong.
router.get('/', function(req, res) {
  res.send("~/artist")
});

router.get('/:id', function(req, res) {
  var artist = new Artist(req.params.id);
  artist.fillArtist(artist).then((result) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(artist));
    console.log("Sent " + artist.name);
  }, (err) => {
    console.error("There was an error with fillArtist");
  })
});

module.exports = router;



/*
  Artist router. Routes GET calls to specific artist MBID's
  to return the correct JSON.
*/

var express = require('express');
var router = express.Router();

// Should not do anything. Maybe explain to the user how they're doing
// it wrong.
router.get('/', function(req, res) {
  res.send("~/artist")
});

router.get('/:id', function(req, res) {

});

module.exports = router;

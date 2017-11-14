/*
  Index router, does nothing relevant to the user
*/

var express = require('express')
var router = express.Router()

router.get('/', function(req, res) {
  console.log('Root')
  res.render('index')
})

module.exports = router

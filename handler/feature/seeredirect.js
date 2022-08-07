const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
  res.type('text').send('FEATURE 1: see the URL it will redirect');
})

module.exports = router
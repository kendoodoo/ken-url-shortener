const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
  res.type('text').send('add /your_short_url_here to get info');
})

module.exports = router

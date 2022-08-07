// import
const mongoose = require('mongoose');

// insert data sequence
const shortUrlSchema = new mongoose.Schema({
  redirectto: {
    type: String,
    required: true
  },
  // remove default because the loop problem
  url: {
    type: String,
    required: true
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  },
  nsfw: {
    type: String,
    required: false,
    default: 'false'
  }
})
module.exports = mongoose.model('ShortUrl', shortUrlSchema);

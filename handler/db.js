const mongoose = require('mongoose');

const shortUrlSchema = new mongoose.Schema({
  redirectto: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    default: Math.random().toString(36).slice(2, 7)
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
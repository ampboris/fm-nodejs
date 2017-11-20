const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
  name: String,
  image: String,
  url: String,
  followers: Number,
  mbid: { // unique id in fm last
    type: String,
    required: true
  }
});

module.exports = ArtistSchema;

const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  
  id: String,
  title: String,
  artist: String,
  album: String,
  duration: String,
  image: String,
  genre: String,
  isLiked: Boolean,
  lyrics: [String],
  audioUrl: String // <-- Add this field
});

module.exports = mongoose.model('Song', SongSchema);

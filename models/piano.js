var mongoose = require("mongoose");

var pianoSchema = new mongoose.Schema({
  title: String,
  make: String,
  model: String,
  year: Number,
  desc: String, // short description
  // TODO: Make body accept markdown for formatting
  body: String, // full description
  l_price: Number,
  a_price: Number,
  yt_url: String, // URL to youtube video
  images: [String],
  date: Date    // date posted, should default to NOW
});

module.exports = mongoose.model("Piano", pianoSchema);
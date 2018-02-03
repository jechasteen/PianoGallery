var mongoose = require("mongoose");
var moment = require("moment");

var pianoSchema = new mongoose.Schema({
  title: String,
  make: String,
  model: String,
  year: Date,     // 4 digit number
  category: String,
  desc: String, // short description
  body: String, // full description
  l_price: Number,
  a_price: Number,
  yt_url: String, // URL to youtube video
  images: [String],
  main_image: String,
  date: { type: Date, default: moment }    // date posted, defaults to NOW
});

module.exports = mongoose.model("Piano", pianoSchema);
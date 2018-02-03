var mongoose = require("mongoose");
var moment = require("moment");

var postSchema = new mongoose.Schema({
  title: String,
  body: String,
  date: { type: Date, default: moment },
  upDate: Date
});

module.exports = mongoose.model("Post", postSchema);
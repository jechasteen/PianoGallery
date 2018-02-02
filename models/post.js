var mongoose = require("mongoose")

var postSchema = new mongoose.Schema({
  title: String,
  body: String,
  date: { type: Date, default: Date.now },
  upDate: Date
});

module.exports = mongoose.model("Post", postSchema);
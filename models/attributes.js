var mongoose = require("mongoose");

var attributeSchema = new mongoose.Schema({
  name: String,     // Homepage title, used throught (e.g. "BHA Piano")
  body: String,     // Text for homepage "Welcome to BHA Piano, the leader...."
  feature: {        // A banner that can promote anything...
    title: String,  // The feature item title
    body: String,   // Text of the feature
    image: String,  // An image for the feature
    url: String     // A link to the blog, piano, etc...
  },
  comments: [{
    name: String,
    body: String
  }]
});

module.exports = mongoose.model("Attr", attributeSchema);
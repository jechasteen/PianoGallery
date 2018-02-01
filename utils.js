var Piano = require("./models/piano");

var utils = {
  spaceToUnderscore: function (string) {
    return string.replace(/ /g, "_");
  },

  pianoFromRequest: function (rb) {
    // Parameter rb = request.body
    // Returns an object of type: Mongoose Schema
    var newPiano = new Piano({
      title: rb.title, make: rb.make,
      model: rb.model, year: rb.year,
      desc: rb.desc, body: rb.body,
      l_price: rb.l_price, a_price: rb.a_price,
      yt_url: rb.yt_url
    });
    return newPiano;
  }
}

module.exports = utils;
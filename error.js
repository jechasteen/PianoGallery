var error = {
  Utils: function (util, func, err) {
    console.log([">>>> Error", util, ":", err].join(' '));
  },

  Route: function (verb, thrower, req, err) {
    console.log(">>>> Error:", verb.toUpperCase(), req.originalUrl, thrower, ":", err);
  },

  Misc: function (err) {
    console.log([">>>> Error:", err].join(' '));
  }
}

module.exports = error; 
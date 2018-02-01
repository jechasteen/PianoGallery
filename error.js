var error = {
  Route: function (verb, thrower, req, err) {
    console.log(">>>> Error: ", verb.toUpperCase, " ", req.originalUrl, thrower, " : ", err);
  },

  Misc: function (err) {
    console.log(">>>> Error: " + err);
  }
}

module.exports = error; 
var Admin = require("./models/admin");

var middleware = {};

middleware.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("back");
  }
}

module.exports = middleware;
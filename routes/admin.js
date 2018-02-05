'use strict';
var express = require("express");
var router = express.Router();
var passport = require("passport");
var Admin = require("../models/admin");
var middleware = require("../middleware");

var page = {};

//
// INDEX
//

router.get("/", function (req, res) {
  if (req.isAuthenticated()) {
    page.title = "Administration"
    res.render("admin/index", { page: page });
  } else {
    res.redirect("/admin/login");
  }
});

//
// Register
//
// TODO: Both register routes should be disabled after setup.
router.get("/register", function (req, res) {
  page.title = "Register Administrator";
  res.render("admin/register", { page: page });
});

router.post("/register", function (req, res) {
  var newAdmin = new Admin({ username: req.body.username });
  Admin.register(newAdmin, req.body.password, function (err, admin) {
    if (err) console.log(err);
    passport.authenticate("local")(req, res, function () {
      res.redirect("/admin");
    });
  });
});

//
// Login
//

router.get("/login", function (req, res) {
  page.title = "Login"
  if (req.isAuthenticated()) {
    res.redirect("/admin");
  }
  res.render("admin/login", {page: page});
});

router.post("/", passport.authenticate("local",
  {
    successRedirect: "/admin",
    failureRedirect: "/admin/login"
  }), function (req, res) {
});

//
// Logout
//

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/gallery");
});

module.exports = router;
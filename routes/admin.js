'use strict';
var express = require("express");
var router = express.Router();
var passport = require("passport");
var Admin = require("../models/admin");
var Attrib = require("../models/attributes");
var middleware = require("../middleware");

var page = {};

//
// INDEX
//

router.get("/", function (req, res) {
  if (req.isAuthenticated()) {
    Attrib.findOne({}, function (err, attrib) {
      if (err) res.redirect("/admin/init");
      else if (attrib === null) res.redirect("/admin/init");
      else {
        page.title = "Administration";
        res.render("admin/index", { page: page, attrib: attrib });
      }
    });
  } else {
    res.redirect("/admin/login");
  }
});

//
// Set Site Attributes
//
// Initialize
router.get("/init", function (req, res) {
  page.title = "Initialize Site Attributes";
  res.render("admin/init", { page, page });
});
router.post("/init", function (req, res) {
  Attrib.create(req.body, function (err, newAttrib) {
    if (err) console.log(err);
    else {
      res.redirect("/admin");
    }
  });
});
// Set if exists
router.get("/set", middleware.isLoggedIn, function (req, res) {
  page.title = "Set Site Attributes";
  Attrib.findOne({}, function (err, attrib) {
    if (err) console.log(err);
    else if( attrib === null ) res.render("admin/init", { page, page });
    else res.render("admin/set", { page: page, attrib: attrib });
  });
});
router.put("/set", function (req, res) {
  Attrib.findOneAndUpdate({}, req.body.attrib, function (err, attrib) {
    if (err) console.log(err);
    else res.redirect("/admin");
  });
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
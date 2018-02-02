'use strict';
var express = require('express');
var router = express.Router();

var Attr = require("../models/attributes");

var page = {};

/* GET home page. */
router.get('/', function (req, res) {
  page.title = "Home";
  res.render("index", { page: page });
});

router.get('/admin', function (req, res) {
  // This will be the route that handles login functionality
  // Admin login really only does two things:
  //    1. If logged in, pages will have an admin bar and/or buttons to allow editing
  //    2. Enable a page that allows setting up site attributes (e.g. sale banner, customer comments, pics);
  page.title = "Site Administration"
  res.render('admin/index', { page: page });
});

router.get('/admin/set', function (req, res) {
  page.title = "Admin Setup";
  res.render("admin/set");
});

router.get('/admin/quick', function (req, res) {
  res.render("admin/quick");
});

router.post('/admin', function (req, res) {
  res.redirect("/admin")
});

module.exports = router;

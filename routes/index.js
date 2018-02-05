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

module.exports = router;

'use strict';
var express = require('express');
var router = express.Router();
var error = require('../error');

var Post = require("../models/post");
// var Attr = require("../models/attributes");

var page = {};

/* GET home page. */
router.get('/', function (req, res) {
  page.title = "Home";
  var blog = Post.findOne({}, {}, { sort: { 'created_at' : -1 } });
  
  blog.exec( function(err, post) {
    if (err) error.Route("GET /", "blog.exec()", req, err);
    else {
      res.render("index", { page: page, blog: post });
    }
  });
});

module.exports = router;

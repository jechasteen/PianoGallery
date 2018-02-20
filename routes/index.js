'use strict';
var express = require('express');
var router = express.Router();

var Post = require("../models/post");
// var Attr = require("../models/attributes");

var page = {};

/* GET home page. */
router.get('/', function (req, res) {
  page.title = "Home";
  var blog = {};
  
  /*
  Post.findOne().sort({created_at: -1}).exec(function(err, post) { 
    if (err) console.log("POST FIND ERR");
    blog = post;
  });
  */
  
  Post.findOne({}, function(err, post) {
    if (err) console.log("POST FIND ERR");
    blog = post;
  })
  
  res.render("index", { page: page, blog: blog });
});

module.exports = router;

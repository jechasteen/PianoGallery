'use strict';
var express = require("express"),
  router = express.Router();
var error = require("../error.js");

var Post = require("../models/post");

var page = {};

// INDEX - List All Posts
router.get("/", function (req, res) {
  // TODO: Blog index sorting
  page.title = "Blog - All";
  Post.find({}, function (err, foundPosts) {
    if (err) error.Route("GET", "Post.find", req, err);
    else {
      res.render("blog/index", { page: page, posts: foundPosts });
    }
  });
});

// NEW - New post form
router.get("/new", function (req, res) {
  page.title = "New Post";
  res.render("blog/new", { page: page });
});

// CREATE - Create the DB entry for the new post
router.post("/", function (req, res) {
  Post.create(req.body, function (err, newPost) {
    if (err) error.Route("POST", "Post.create", req, err);
    else res.redirect("/blog");
  });
});

// SHOW - Show a page for one post
router.get("/:id", function (req, res) {
  Post.findById(req.params.id, function (err, foundPost) {
    if (err) error.Route("GET", "Post.findById", req, err);
    else {
      page.title = foundPost.title;
      res.render("blog/show", { page: page, post: foundPost, post: foundPost });
    }
  });
});

// EDIT - Edit post form
router.get("/:id/edit", function (req, res) {
  Post.findById(req.params.id, function (err, foundPost) {
    if (err) error.Route("GET", "Post.findById", req, err);
    else {
      page.title = "Editing " + foundPost.title;
      res.render("blog/edit", { page: page, post: foundPost});
    }
  });
});

// UPDATE - Update the DB entry from EDIT
router.put("/:id", function (req, res) {
  var editedPost = { title: req.body.title, body: req.body.body, date: Date.now() }

  Post.findByIdAndUpdate(req.params.id, req.body.post, function (err, updatedPost) {
    if (err) error.Route("PUT", "Post.findByIdAndUpdate", req, err);
    else {
      updatedPost.date = Date.now();
      updatedPost.save(function (err) {
        if (err) error.Route("PUT", "Post.save", req, err);
      });
      res.redirect("/blog/" + req.params.id);
    }
  });
});

// DESTROY - Delete a post
router.delete("/:id", function (req, res) {
  Post.findByIdAndRemove(req.params.id, function (err) {
    if (err) error.Route("DELETE", "Post.findByIdAndRemove", req, err);
    else res.redirect("/blog");
  })
});

module.exports = router;
'use strict';
var express = require("express"),
  router = express.Router();
var middleware = require("../middleware");

var error = require("../error.js");

var Post = require("../models/post");

var page = {};

// INDEX - List All Posts
router.get("/", function (req, res) {
  // TODO: Blog index sorting
  page.title = "Blog";
  if (req.isAuthenticated()) {
    page.admin = true;
  } else {
    page.admin = false;
  }
  Post.find({}, function (err, foundPosts) {
    if (err) error.Route("GET", "Post.find", req, err);
    else {
      res.render("blog/index", { page: page, posts: foundPosts });
    }
  });
});

// NEW - New post form
router.get("/new", middleware.isLoggedIn, function (req, res) {
  if (req.isAuthenticated) {
    page.admin = true;
  } else {
    page.admin = false;
  }
  page.title = "New Post";
  res.render("blog/new", { page: page });
});

// CREATE - Create the DB entry for the new post
router.post("/", middleware.isLoggedIn, function (req, res) {
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
      if (req.isAuthenticated()) {
        page.admin = true;
      }
      page.title = foundPost.title;
      res.render("blog/show", { page: page, post: foundPost, post: foundPost });
    }
  });
});

// EDIT - Edit post form
router.get("/:id/edit", middleware.isLoggedIn, function (req, res) {
  Post.findById(req.params.id, function (err, foundPost) {
    if (err) error.Route("GET", "Post.findById", req, err);
    else {
      page.title = "Editing " + foundPost.title;
      res.render("blog/edit", { page: page, post: foundPost});
    }
  });
});

// UPDATE - Update the DB entry from EDIT
router.put("/:id", middleware.isLoggedIn, function (req, res) {
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
router.delete("/:id", middleware.isLoggedIn, function (req, res) {
  Post.findByIdAndRemove(req.params.id, function (err) {
    if (err) error.Route("DELETE", "Post.findByIdAndRemove", req, err);
    else res.redirect("/blog");
  })
});

module.exports = router;
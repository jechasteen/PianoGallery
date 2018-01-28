var express = require("express");
var router = express.Router();
var Piano = require("../models/piano");

// INDEX
router.get("/", function (req, res) {
  var page = {
    title: "Piano Gallery"
  }
  res.render("gallery/index", { page: page });
});

// NEW
router.get("/new" /* logged in */, function (req, res) {
  var page = {
    title: "Create New Piano"
  }
  res.render("gallery/new", { page: page });
});

// CREATE
router.post("/" /* logged in */, function (req, res) {
  res.redirect("/gallery");
});

// SHOW
router.get("/:id", function (req, res) {
  res.send("Gallery - show a piano");
});

// EDIT
router.get("/:id/edit" /* logged in */, function (req, res) {
  res.redirect(req.params.id);
});

// UPDATE
router.get("/:id" /* logged in */, function (req, res) {
  res.redirect("/gallery");
});

// DESTROY
router.delete("/:id" /* logged in */, function (req, res) {
  res.redirect("/gallery");
});

module.exports = router;
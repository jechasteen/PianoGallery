'use strict';
var express = require("express");
var router = express.Router();
var Piano = require("../models/piano");
var formidable = require("formidable");

var imageDirectory = "c:\\Users\\jonat\\source\\repos\\BHA_piano\\public\\images";

var page = {};

// INDEX
router.get("/", function (req, res) {

  if (req.body) {
    // UNDONE: Write handling logic for query strings
  } else {
    page.title = "All Pianos"
  } 
  res.render("gallery/index", { page: page });
});

// NEW
router.get("/new" /* TODO: logged in new gallery */, function (req, res) {
  page.title = "Create New Piano";
  res.render("gallery/new", { page: page });
});

// CREATE
router.post("/" /* TODO: logged in create piano*/, function (req, res) {
  var form = formidable.IncomingForm();
  form.uploadDir = imageDirectory;
  console.log(form);
  form.parse(req, function (err, fields, files) {
    console.log(fields, files);
  })

  res.redirect("/gallery/new");
  /*
  var rb = req.body;
  var newPiano = {
    title: rb.title,    make: rb.make,
    model: rb.model,    year: rb.year, desc: rb.desc,
    body: rb.body,      l_price: rb.l_price,
    a_price: rb.a_price, yt_url: rb.yt_url,
    images: rb.images,  date: rb.date
  }
  Piano.create(newPiano, function (err, newPiano) {
    if (err) {
      console.log("error: Piano.create : " + err);
    } else {
      console.log(newPiano);
      res.redirect("/gallery");
    }
  }); */
});

// SHOW
router.get("/:id", function (req, res) {
  //TODO: Body should render git style markdown
  res.send("Gallery - show a piano");
});

// EDIT
router.get("/:id/edit" /* TODO: logged in edit piano*/, function (req, res) {
  res.redirect(req.params.id);
});

// UPDATE
router.get("/:id" /* TODO: logged in update piano */, function (req, res) {
  res.redirect("/gallery");
});

// DESTROY
router.delete("/:id" /* TODO: logged in destroy piano */, function (req, res) {
  res.redirect("/gallery");
});

module.exports = router;
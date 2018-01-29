'use strict';
var express = require("express");
var router = express.Router();
var Piano = require("../models/piano");
var formidable = require("formidable");
var fs = require("fs");
var utils = require("../utils.js");

var imageDirectory = "c:\\Users\\jonat\\source\\repos\\BHA_piano\\public\\images\\";

var page = {};

// INDEX
router.get("/", function (req, res) {
  Piano.find({}, function (err, allPianos) {
    page.title = "All Pianos";
    res.render("gallery/index", { page: page, pianos: allPianos });
  }); 
});

// NEW
router.get("/new" /* TODO: logged in new gallery */, function (req, res) {
  page.title = "Create New Piano";
  res.render("gallery/new", { page: page });
});

// CREATE
router.post("/" /* TODO: logged in create piano*/, function (req, res) {
  // TODO: Make sure Piano.title does not already exist in database before creating

  // get incoming form
  var form = formidable.IncomingForm();
  form.uploadDir = imageDirectory;
  form.multiples = true;

  var title = "";
  var newPiano = {};

  form.parse(req, function (err, fields, files) {
    console.log("Form has been parsed...")
  });

  // Set the fields for the new piano from the form data
  form.on("field", function (name, value) {
    switch (name) {
      case "title":
        title = utils.spaceToUnderscore(value);
        newPiano.title = value;
        break;
      case "make":
        newPiano.make = value;
        break;
      case "model":
        newPiano.model = value;
        break;
      case "year":
        newPiano.year = value;
        break;
      case "desc":
        newPiano.desc = value;
        break;
      case "body":
        newPiano.body = value;
        break;
      case "l_price":
        newPiano.l_price = value;
        break;
      case "a_price":
        newPiano.a_price = value;
        break;
      case "yt_url":
        newPiano.yt_url = value;
        break;
      default:
        break;
    }
  });
  var images = [];

  // Activates for each uploaded file
  form.on("file", function (name, file) {
    var ext = utils.getFileExt(file.name);
    var filename = title + file.size + "." + ext;
    var oldpath = file.path;
    var newpath = imageDirectory + filename;
    images.push("/images/" + filename);
    fs.rename(oldpath, newpath, function (err) {
      if (err) console.log("error: POST /gallery fs.rename: " + err);
    });
  });

  form.on("end", function () {
    newPiano.images = images;
    // Finally, create new Piano in DB
    Piano.create(newPiano, function (err, newPiano) {
      if (err) console.log("error: POST /gallery, Piano.create: " + err);
      else {
        console.log("New Piano has been created");
        res.redirect("/gallery");
      }
    });
  });
});

// SHOW
router.get("/:id", function (req, res) {
  //TODO: Piano body should render git style markdown
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
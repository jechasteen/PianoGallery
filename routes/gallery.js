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
  // get incoming form
  var form = formidable.IncomingForm();
  form.uploadDir = imageDirectory;
  form.multiples = true;

  var title = "";
  var gallery_image = "";
  var newPiano = {};

  form.parse(req, function (err, fields, files) {
    console.log("New Piano form has been parsed...")
  });

  // Set the fields for the new piano from the form data
  form.on("field", function (name, value) {
    switch (name) {
      case "title":
        title = utils.spaceToUnderscore(value);
        newPiano.title = title;
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
      case "main_image":
        gallery_image = value;
      default:
        break;
    }
  });

  // Create image array for Piano
  var images = [];
  var file_list = [];

  // Activates for each uploaded file
  form.on("file", function (name, file) {
    console.log(name + "<->" + file.name);
    var ext = utils.getFileExt(file.name);
    var filename = title + file.size + "." + ext;
    var oldpath = file.path;
    var newpath = imageDirectory + filename;
    
    images.push(filename);
    file_list.push(file.name);
    
    fs.rename(oldpath, newpath, function (err) {
      if (err) console.log("error: POST /gallery fs.rename: " + err);
    });
  });
  // Once all of the files have been processed
  form.on("end", function () {   
    newPiano.images = images;
    console.log(gallery_image);
    newPiano.main_image = file_list.indexOf(gallery_image);
    // Finally, create new Piano in DB
    if (!Piano.find({ title: newPiano.title })) {
      Piano.create(newPiano, function (err, newPiano) {
        if (err) console.log("error: POST /gallery, Piano.create: " + err);
        else {
          console.log("New Piano has been created");
          res.redirect("/gallery");
        }
      });
    } else {
      // TODO: Flash a message, title already exists
      res.redirect("/gallery/new");
    }
    
  });
});

// SHOW
router.get("/:id", function (req, res) {
  //TODO: Piano body should render git style markdown
  Piano.findById(req.params.id, function (err, foundPiano) {
    page.title = foundPiano.title;
    res.render("gallery/piano", { page: page, piano: foundPiano });
  })
});

// EDIT
router.get("/:id/edit" /* TODO: logged in edit piano*/, function (req, res) {
  Piano.findById(req.params.id, function (err, foundPiano) {
    page.title = "Editing " + foundPiano.title;
    res.render("gallery/edit", { page: page, piano: foundPiano });
  });
});

// UPDATE ->> Update route for fields
router.put("/:id" /* TODO: logged in update piano */, function (req, res) {
  var rb = req.body;
  var updatedPiano = {
    title: rb.title, make: rb.make, model: rb.model,
    year: rb.year,   desc: rb.desc, body: rb.body,
    l_price: rb.l_price, a_price: rb.a_price, yt_url: rb.yt_url
  }
  Piano.findByIdAndUpdate(req.params.id, updatedPiano, function (err, updatedPiano) {
    if (err) console.log("error: PUT /gallery/:id, Piano.findByIdAndUpdate: " + err);
    else res.redirect("/gallery");
  })
});

// UPDATE ->> Update route for images, i.e. add new images...
router.put("/:id/chgimg", function (req, res) {
  // UNDONE: Add image to piano
  res.redirect("/gallery/" + req.params.id);
})

// DELETE ->> Delete route for images
router.delete("/:id/delimg/:index", function (req, res) {
  var updatedPiano = {};

  Piano.findById(req.params.id, function (err, foundPiano) {
    updatedPiano = foundPiano;
    updatedPiano.images.splice(req.params.index, 1);
    // remove image from the filesystem first
    fs.unlink(imageDirectory + foundPiano.images[req.params.index], function (err) {
      if (err) console.log("error: DELETE /gallery/:id/delimg/:index, fs.unlink: " + err);
    });
    console.log(updatedPiano);
  });
  // then remove it form the db
  Piano.findByIdAndUpdate(req.params.id, updatedPiano, function (err, updatedPiano) {
    if (err) console.log("error: DELETE /gallery/:id/delimg/:index, Piano.findByIdAndUpdate: " + err);
    else res.redirect("/gallery/" + req.params.id + "/edit");
  });
});

// DESTROY
router.delete("/:id" /* TODO: logged in destroy piano */, function (req, res) {
  // First find and remove all associated images
  Piano.findById(req.params.id, function (err, foundPiano) {
    foundPiano.images.forEach(function (img) {
      fs.unlink(imageDirectory + img, function (err) {
        if (err) console.log("error: DELETE /gallery/:id, Piano.findById -> fs.unlink: " + err);
        else console.log("Sucessfully deleted" + img);
      });
    });
  });
  // Then remove the entry from the DB
  Piano.findByIdAndRemove(req.params.id, function (err) {
    if (err) console.log("error: DELETE /gallery/:id, Piano.findByIdAndRemove: " + err);
    else res.redirect("/gallery");
  })
});

module.exports = router;
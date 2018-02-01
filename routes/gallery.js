﻿'use strict';
var express = require("express");
var router = express.Router();
var Piano = require("../models/piano");
var formidable = require("formidable");
var fs = require("fs");
var utils = require("../utils.js");

var imageDirectory = "c:\\Users\\jonat\\source\\repos\\BHA_piano\\public\\images\\";
var uploadDirectory = "c:\\Users\\jonat\\source\\repos\\BHA_piano\\uploads\\";

var page = {};

function setAttr()

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
  var rb = req.body;
  var newPiano = new Piano;
  newPiano.title = rb.title;
  newPiano.make = rb.make;
  newPiano.model = rb.model;
  newPiano.year = rb.year;
  newPiano.desc = rb.desc;
  newPiano.body = rb.body;
  newPiano.l_price = rb.l_price;
  newPiano.a_price = rb.a_price;
  newPiano.yt_url = rb.yt_url;

  Piano.create(newPiano, function (err, createdPiano) {
    if (err) console.log("error: POST /gallery, Piano.create: " + err);
    else res.redirect("/gallery/" + createdPiano._id + "/addimg");
  });
});
// -> CREATE/Add Images
router.get("/:id/addimg", function (req, res) {
  Piano.findById(req.params.id, function (err, foundPiano) {
    if (err) console.log("error: GET /gallery/:id/addimg, Piano.find: " + err);
    else {
      page.title = "Add images to new piano: " + foundPiano.title;
      res.render("gallery/addimg", {page: page, piano: foundPiano });
    }
  });
});
// -> CREATE/Update Piano.images and .main_image
// Really an UPDATE route
router.put("/:id/addimg", function (req, res) {
  // make new directory for new piano named Piano._id
  var imgDir = imageDirectory + req.params.id;
  if (!fs.existsSync(imgDir)) {   // BLOCKING
    fs.mkdir(imageDirectory + req.params.id, function (err) {
      if (err) console.log("error: PUT /gallery/:id/addimg, fs.mkdir: " + err);
    });
  } else {
    console.log("Folder already existed, continuing...");
  }
  
  // handle upload
  var form = formidable.IncomingForm();
  form.uploadDir = imgDir;
  form.multiples = true;

  form.parse(req, function (err, fields, files) {
    console.log("PUT /gallery/:id/addimg: form parsed...")
  });

  var main_image = "";

  form.on("field", function (name, value) {
    if (name === "main_image") {
      main_image = value;
    }
  });

  var images = []
  form.on("file", function (name, file) {
    fs.renameSync(file.path, imgDir + "\\" + file.name, function (err) {
      if (err) console.log("error: PUT /gallery/:id/addimg fs.rename: " + err);
    });
    images.push(file.name);
  });

  form.on("end", function () {
    Piano.findById(req.params.id, function (err, foundPiano) {
      if (err) console.log("error: PUT /gallery/:id/addimg, Piano.findById: " + err);
      else {
        foundPiano.images = images;
        foundPiano.main_image = main_image;
        console.log(foundPiano);
        foundPiano.save(function (err) {
          if (err) console.log("error: PUT /gallery/:id/addimg, foundPiano.save() : " + err);
        });
        res.redirect("/gallery/" + req.params.id)
      }
    });
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
  console.log(req.body.piano);
  Piano.findByIdAndUpdate(req.params.id, req.body.piano, function (err, updatedPiano) {
    if (err) console.log("error: PUT /gallery/:id, Piano.findByIdAndUpdate: " + err);
    else {
      res.redirect("/gallery/" + req.params.id);
    }
  });
});

//////
// UPDATE ->> Update route for images, i.e. add new images...
// show
router.get("/:id/chgimg", function (req, res) {
  Piano.findById(req.params.id, function (err, foundPiano) {
    if (err) console.log("error: GET /gallery/:id/chgimg, Piano.findById : " + err);
    else {
      page.title = "Add images to " + foundPiano.title;
      res.render("gallery/chgimg", { page: page, piano: foundPiano });
    }
  })
  
});
// put
router.put("/:id/chgimg", function (req, res) {
  var form = formidable.IncomingForm();
  form.uploadDir = imageDirectory + req.params.id;
  var imgDir = imageDirectory + req.params.id;

  form.parse(req, function (err, fields, files) {
    console.log("PUT /gallery/:id/chgimg form parsed...")
  });

  var newImages = [];
  form.on("file", function (name, file) {
    fs.renameSync(file.path, imgDir + "\\" + file.name, function (err) {
      if (err) console.log("error: PUT /gallery/:id/addimg fs.rename: " + err);
    });
    newImages.push(file.name);
  });

  form.on("end", function () {
    if (newImages.length === 0) {
      res.redirect("/gallery/" + req.params.id);
    }
    Piano.findById(req.params.id, function (err, foundPiano) {
      if (err) console.log("error: PUT /gallery/:id/chgimg, Piano.findById : " + err);
      else {
        // HACK: Evidently mongoose $pushAll is deprecated, this is a workaround
        var foundImages = foundPiano.images;
        foundPiano.images = foundImages.concat(newImages);
        foundPiano.save(function (err) {
          if (err) console.log("error: PUT /gallery/:id/chgimg, foundPiano.save : " + err);
          else res.redirect("/gallery/" + req.params.id + "/edit");
        });
      }
    });
  });
});

// DELETE ->> Delete route for images
router.delete("/:id/delimg/:index", function (req, res) {
  Piano.findById(req.params.id, function (err, foundPiano) {
    var idx = foundPiano.images.indexOf(req.params.index);
    foundPiano.images.splice(idx, 1);
    // remove image from the filesystem first
    fs.unlink(imageDirectory + req.params.id + "/" + req.params.index, function (err) {
      if (err) console.log("error: DELETE /gallery/:id/delimg/:index, fs.unlink: " + err);
    });

    foundPiano.save(function (err) {
      if (err) console.log("error: DELETE /:id/delimg/:index, updatedPiano.save() : " + err);
      else res.redirect("/gallery/" + req.params.id + "/edit")
    });
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
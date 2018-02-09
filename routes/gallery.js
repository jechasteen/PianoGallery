// TODO: Find places where res.redirect(...) can be replaced with "back"

'use strict';
var express = require("express");
var router = express.Router();
var Piano = require("../models/piano");
var formidable = require("formidable");
var fs = require("fs");
var utils = require("../utils.js");
var error = require("../error.js");
var middleware = require("../middleware");
var isLoggedIn = middleware.isLoggedIn;


var imageDirectory = "c:\\Users\\jonat\\source\\repos\\BHA_piano\\public\\images\\";
var uploadDirectory = "c:\\Users\\jonat\\source\\repos\\BHA_piano\\uploads\\";

var page = {};

//
// INDEX
//
router.get("/", function (req, res) {
  var cat;
  Piano.find({}, function (err, allPianos) {
    page.title = "All Pianos";
    if (req.isAuthenticated()) {
      page.admin = true;
    } else {
      page.admin = false;
    }
    res.render("gallery/index", { page: page, pianos: allPianos });
  }); 
});

//
// NEW
//
router.get("/new", isLoggedIn, function (req, res) {
  page.title = "Create New Piano";
  res.render("gallery/new", { page: page });
});

// CREATE
//
// -> Post the form data
router.post("/", isLoggedIn, function (req, res) {
  Piano.find({ title: req.body.title }, function (err, foundPiano) {
    if (err) {  // piano not found
      Piano.create(utils.pianoFromRequest(req), function (err, createdPiano) {
        if (err) {
          error.Route("post", "Piano.create", req, err);
          // TODO: Piano Create Route FLASH message
          res.redirect("/gallery/new");
        }
        else res.redirect("/gallery/" + createdPiano._id + "/addimg");
      });
    } else {
      if (foundPiano === null) {
        res.redirect("/gallery/new")
      } else {
        utils.updateThenAddImg(req, res, foundPiano._id);
      }
    }
  });
});
// -> SHOW Add Images Form
router.get("/:id/addimg", isLoggedIn, function (req, res) {
  Piano.findById(req.params.id, function (err, foundPiano) {
    if (err) {
      error.Route("get", "Piano.findById", req, err);
      res.redirect("/gallery/" + req.params.id);
    }
    else {
      page.title = "Add images to new piano: " + foundPiano.title;
      res.render("gallery/addimg", {page: page, piano: foundPiano });
    }
  });
});
// -> CREATE/Update Piano.images[] and .main_image
// *** Really an UPDATE route ADDS initial images.
router.put("/:id/addimg", isLoggedIn, function (req, res) {
  // make new directory for new piano named Piano._id
  var imgDir = imageDirectory + req.params.id;
  if (!fs.existsSync(imgDir)) {   // BLOCKING
    fs.mkdir(imageDirectory + req.params.id, function (err) {
      if (err) {
        error.Route("PUT", "fs.mkdir", req, err);
        res.redirect("/gallery/" + req.params.id);
      }
    });
  } else error.Misc("Folder already existed, continuing...");
  
  // Initialize Formidable
  var form = formidable.IncomingForm({ uploadDir: imgDir, multiples: true });

  form.parse(req, function (err, fields, files) {});
  // Set the main image from the form data
  var main_image = "";
  form.on("field", function (name, value) {
    if (name === "main_image") main_image = value;
  });

  // capture the image file names
  var images = []
  form.on("file", function (name, file) {
    fs.renameSync(file.path, imgDir + "\\" + file.name, function (err) {
      if (err) {
        error.Route("PUT", "fs.rename", req, err);
        res.redirect("/gallery/" + req.params.id);
      }
    });
    images.push(file.name);
  });
  // After all processing is done, save the array
  form.on("end", function () {
    if (!fs.existsSync(imgDir)) {
      fs.mkdirSync(imgDir);
    }
    Piano.findById(req.params.id, function (err, foundPiano, ) {
      if (err) {
        error.Route("PUT", "Piano.findById", req, err);
        res.redirect("/gallery/" + req.params.id);
      }
      else {
        foundPiano.images = images;
        foundPiano.main_image = main_image;
        foundPiano.save(function (err) {
          if (err) {
            error.Route("PUT", "foundPiano.save", req, err);
            res.redirect("/gallery/" + req.params.id)
          }
        });
        res.redirect("/gallery/" + req.params.id)
      }
    });
  });
});
// -> CREATE Select the main (gallery) image
router.post("/:id/mainimg", isLoggedIn, function (req, res) {
  Piano.findById(req.params.id, function (err, foundPiano) {
    if (err) {
      error.Route("PUT", "Piano.findById", req, err);
      res.redirect("/gallery/" + req.params.id);
    }
    else {
      foundPiano.main_image = req.body.main_image;
      foundPiano.save(function (err) {
        if (err) {
          error.Route("PUT", "Piano.findById -> Piano.save", req, err);
          res.redirect("/gallery/" + req.params.id);
        }
        else res.redirect("/gallery/" + req.params.id);
      });
    }
  });
});

//
// SHOW  This is a PUBLIC Route!!
//
router.get("/:id", function (req, res) {
  //TODO: Piano body should render git style markdown
  Piano.findById(req.params.id, function (err, foundPiano) {
    if (err) {
      error.Route("GET", "Piano.findById", req, err);
      res.redirect("/gallery");
    } else {
      page.title = foundPiano.title;
      res.render("gallery/piano", { page: page, piano: foundPiano });
    }
  })
});

//
// EDIT
//
// Show edit form
router.get("/:id/edit", isLoggedIn, function (req, res) {
  Piano.findById(req.params.id, function (err, foundPiano) {
    if (err) {
      error.Route("GET", "Piano.findById", req, err);
      res.redirect("/gallery/" + req.params.id);
    } else {
      page.title = "Editing " + foundPiano.title;
      res.render("gallery/edit", { page: page, piano: foundPiano });
    }
  });
});
// UPDATE ->> Update route for fields
router.put("/:id", isLoggedIn, function (req, res) {
  Piano.findByIdAndUpdate(req.params.id, req.body.piano, function (err, updatedPiano) {
    if (err) {
      error.Route("PUT", "Piano.findByIdAndUpdate", req, err);
      res.redirect("/gallery/" + req.params.id + "/edit");
    }
    else res.redirect("/gallery/" + req.params.id);
  });
});

//
// UPDATE ->> Update route for images, i.e. add new images...
//
// show add images form
router.get("/:id/chgimg", isLoggedIn, function (req, res) {
  Piano.findById(req.params.id, function (err, foundPiano) {
    if (err) {
      error.Route("GET", "Piano.findById", req, err);
      res.redirect("/gallery/" + req.params.id + "/chgimg");
    }
    else {
      page.title = "Add images to " + foundPiano.title;
      res.render("gallery/chgimg", { page: page, piano: foundPiano });
    }
  })
  
});
// Push the added filenames to the piano
router.put("/:id/chgimg", isLoggedIn, function (req, res) {
  var imgDir = imageDirectory + req.params.id;
  var form = formidable.IncomingForm({ uploadDir: imgDir, multiples: true });

  if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir);
  }

  form.parse(req, function (err, fields, files) { });

  // Get the new images from admin
  var newImages = [];
  form.on("file", function (name, file) {
    fs.renameSync(file.path, form.uploadDir + "\\" + file.name, function (err) {
      if (err) {
        error.Route("PUT", "fs.rename", req, err);
        res.redirect("/gallery/" + req.params.id + "/chgimg");
      }
    });
    newImages.push(file.name);
  });

  // After files are finished, save piano
  form.on("end", function () {
    Piano.findById(req.params.id, function (err, foundPiano) {
      if (err) error.Route("PUT", "Piano.findById", req, err);
      else {
        // HACK: Evidently mongoose $pushAll is deprecated, this is a workaround
        var foundImages = foundPiano.images;
        foundPiano.images = foundImages.concat(newImages);
        foundPiano.save(function (err) {
          if (err) {
            console.error("error: PUT /gallery/:id/chgimg, foundPiano.save : ", err);
            res.redirect("/gallery/" + req.params.id + "/chgimg");
          }
          else res.redirect("/gallery/" + req.params.id + "/edit");
        });
      }
    });
  });
});

// DELETE ->> Delete route for images
router.delete("/:id/delimg/:index", isLoggedIn, function (req, res) {
  Piano.findById(req.params.id, function (err, foundPiano) {
    var idx = foundPiano.images.indexOf(req.params.index);
    foundPiano.images.splice(idx, 1);

    // remove image from the filesystem first
    fs.unlink(imageDirectory + req.params.id + "/" + req.params.index, function (err) {
      if (err) {
        error.Route("DELETE", "fs.unlink", req, err);
        res.redirect("/gallery/" + req.params.id + "/edit");
      }
    });

    foundPiano.save(function (err) {
      if (err) {
        error.Route("DELETE", "updatedPiano.save", req, err);
        res.redirect("/gallery/" + req.params.id + "/edit");
      }
      else res.redirect("/gallery/" + req.params.id + "/edit")
    });
  });
});

// DESTROY
router.delete("/:id", isLoggedIn, function (req, res) {
  // First find and remove all associated images
  Piano.findById(req.params.id, function (err, foundPiano) {
    foundPiano.images.forEach(function (img) {
      fs.unlink(imageDirectory + img, function (err) {
        if (err) {
          error.Route("DELETE", "Piano.findById", req, err);
          res.redirect("/gallery/");
        }
      });
    });
  });
  // Then remove the entry from the DB
  Piano.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      error.Route("DELETE", "Piano.findByIdAndRemove", req, err);
      res.redirect("/gallery");
    }
    else res.redirect("/gallery");
  })
});

module.exports = router;
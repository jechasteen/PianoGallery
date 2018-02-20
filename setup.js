'use strict';
var mongoose = require("mongoose");
var prompt = require("prompt");
var Admin = require("./models/admin");
var Menu = require("terminal-menu");

// passport setup
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function (username, password, done) {
    Admin.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
// User ID is serialized to the session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  Admin.findById(id, function (err, user) {
    done(err, user);
  });
});

mongoose.connect(process.env.DBURL, { useMongoClient: true });

// Prompt Schemas
var promptSchema = {
  properties: {
    username: {
      pattern: /^[a-zA-Z\s\-]+$/,
      message: 'Name must be only letters, spaces, or dashes',
      required: true
    },
    password: {
      hidden: true
    }
  }
};

var removeSchema = {
  properties: {
    username: {
      pattern: /^[a-zA-Z\s\-]+$/,
      message: 'Name must be only letters, spaces, or dashes',
      required: true
    }
  }
}

//
// Administration Object
//
// Create: Create a new administrator account
// Remove: Delete an Administrator
// Auth: Check if 

var administration = {
  create: function () {
    prompt.start();
    prompt.get(promptSchema, function (err, result) {
      var account = new Admin({ username: result.username });
      Admin.register(account, result.password, function (err, user) {
        if (err) {
          console.log("Error: Admin.register(): " + err);
        }
      });
    });
  },

  remove: function () {
    var username;
    prompt.get(removeSchema, function (err, result) {
      if (err) console.log(err);
      Admin.findOneAndRemove({ username: result.username }, function (err) {
        if (err) console.log("Error: administration.remove::Admin.findOneAndRemove : " + err);
      });
    });
  },

  auth: function () {
    prompt.get(promptSchema, function (err, result) {
      var req = {};
      req.user.username = result.username;
      req.user.password = result.password;
      passport.authenticate("local");
    });
  },

  updatePassword: function () {
    prompt.get(promptSchema, function (err, result) {
      Admin.findByIdAndUpdate({ username: result.username }, function (err, foundAdmin) {
        if (err) console.log("Error: administration.updatePassword::Admin.findByIdAndUpdate() : " + err);
        else {

        }
      })
    });
  },

  listAll: function () {
    console.log("All Administrators: ");
    Admin.find({}, function (err, foundAdmins) {
      if (err) console.log("Error: administration.listAll::Admin.find() : " + err);
      else {
        foundAdmins.forEach(function (a) {
          console.log([">>", a.username].join(' '));
        });
      }
    });
  }
}

//
//  Menu
//
var adm = administration;
var menu = Menu({ width: 33, x: 4, y: 2 });
menu.reset();
menu.write('BHA Piano Administration Accounts\n');
menu.write('---------------------------------\n');

menu.add('Create New Administrator');
menu.add('Change Password');
menu.add('Delete Administrator', adm.remove);
menu.add('List All Administrators', adm.listAll);
menu.add('Exit');

menu.on('select', function (label) {
  menu.close();
  switch (label) {
    case 'Create New Administrator':
      adm.create();
      break;
    case 'Change Password':
      break;
    case 'Delete Administrator':
      break;
    case 'List All Administrators':
      break;
    case 'Exit':
    default:
      break;
  }
  menu.reset();
});
process.stdin.pipe(menu.createStream()).pipe(process.stdout);

process.stdin.setRawMode(true);
menu.on('close', function () {
  process.stdin.setRawMode(false);
  process.stdin.end();
});
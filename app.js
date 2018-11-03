'use strict';
var page = {};

// var seed = require("./seed");

// var debug = require('debug');
var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');
var utils = require("./utils");
var Admin = require("./models/admin");

mongoose.connect(process.env.DBURL, { useMongoClient: true });

// Seed the DB
//seed(50);

var indexRoutes = require('./routes/index');
var galleryRoutes = require('./routes/gallery');
var blogRoutes = require('./routes/blog');
var adminRoutes = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));

var expressSessionSettings = {
  secret: 'Keyboard',
  saveUninitialized: true,
  resave: false
};
// PASSPORT CONFIG
app.use(require("express-session")(expressSessionSettings));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

// Include Routes
app.use('/', indexRoutes);
app.use('/gallery', galleryRoutes);
app.use('/blog', blogRoutes);
app.use('/admin', adminRoutes);

// Middleware, adds user info to response automatically
app.use(function (req, res, next) {
  res.locals.currentUser = req.username;
  //res.locals.error = req.flash("error");
  //res.locals.success = req.flash("success");
  next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      page: page,
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  page.title = "ERROR";
  res.status(err.status || 500);
  res.render('error', {
    page: page,
    message: err.message,
    error: {}
  });
});

app.listen(process.env.PORT, process.env.IP, function () {
  console.log("BHA Piano server listening at http://" +
    utils.Host(process.env.IP) + ":" + process.env.PORT);
})

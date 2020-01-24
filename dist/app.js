"use strict";

var _path = _interopRequireDefault(require("path"));

var _constants = require("./config/constants");

var _routes = _interopRequireDefault(require("./routes/routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var express = require('express');

var app = express();

var bodyParser = require("body-parser");

var mongoose = require("mongoose");

var passport = require('passport');

var LocalStrategy = require('passport-local');

var passportLocalMongoose = require('passport-local-mongoose');

var nodemailer = require('nodemailer');

var cloudinary = require('cloudinary');

var cloudinaryStorage = require('multer-storage-cloudinary');

var multer = require('multer');

app.set('views', _path["default"].join(__dirname, 'views')); // Redirect to the views directory inside the src directory

app.use(express["static"](_path["default"].join(__dirname, '../public'))); // load local css and js files

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
})); // PASSPORT CONFIG

app.use(require("express-session")({
  secret: _constants.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  expires: new Date(Date.now() + 30 * 86400 * 1000)
}));
app.use(passport.initialize());
app.use(passport.session()); // passport.use("local", new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});
(0, _routes["default"])(app);
var PORT = process.env.PORT;
app.listen(PORT, process.env.IP, function () {
  console.log("Listening on ".concat(PORT));
});
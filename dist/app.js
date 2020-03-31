"use strict";

var _path = _interopRequireDefault(require("path"));

var _db = require("./database/db");

var _organization = require("./middlewares/organization");

var _constants = require("./config/constants");

var _routes = require("./routes/routes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var express = require('express');

var app = express();

var bodyParser = require("body-parser");

var mongoose = require("mongoose");

var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;

var passportLocalMongoose = require('passport-local-mongoose');

var nodemailer = require('nodemailer');

var cloudinary = require('cloudinary');

var cloudinaryStorage = require('multer-storage-cloudinary');

var multer = require('multer');

var geoip = require('geoip-lite');

var subdomain = require('express-subdomain');

var _require = require('./database/multiDb.js'),
    connect = _require.connect,
    getDBInstance = _require.getDBInstance;

(0, _db.startDb)();
connect();
app.set('views', _path["default"].join(__dirname, 'views')); // Redirect to the views directory inside the src directory

app.use(express["static"](_path["default"].join(__dirname, '../public'))); // load local css and js files

app.set('view engine', 'ejs');
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(require("express-session")({
  secret: _constants.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  expires: new Date(Date.now() + 30 * 80000 * 1000),
  cookie: {
    maxAge: 30 * 80000 * 1000
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});
app.use('/org/:urlname', function (req, res, next) {
  req.dbModels = getDBInstance(req.params.urlname.toLowerCase()).models;

  if (req.session.userId == undefined) {
    return next();
  } else {
    var userId = req.session.userId;
    var User = req.dbModels.User;
    User.findById(userId, function (err, user) {
      if (user) {
        req.user = user;
        res.locals.currentUser = req.user;
        return next();
      } else if (!user) {
        return next();
      }
    });
  }
});
(0, _routes.initRoutes)(app);
var PORT = process.env.PORT;
app.all('*', function (req, res) {
  return res.status(404).json({
    message: 'You seem lost... no resource found'
  });
});
app.listen(PORT, process.env.IP, function () {
  console.log("Listening on ".concat(PORT));
});
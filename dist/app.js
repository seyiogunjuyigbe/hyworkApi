"use strict";

var _path = _interopRequireDefault(require("path"));

var _db = require("./database/db");

var _constants = require("./config/constants");

var _routes = require("./routes/routes");

var _User = require("./models/User");

var _Organization = require("./models/Organization");

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

(0, _db.startDb)();
app.set('views', _path["default"].join(__dirname, 'views')); // Redirect to the views directory inside the src directory

app.use(express["static"](_path["default"].join(__dirname, '../public'))); // load local css and js files

app.set('view engine', 'ejs');
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(require("express-session")({
  secret: _constants.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  expires: new Date(Date.now() + 30 * 80000 * 1000)
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});
(0, _routes.initRoutes)(app); // Organization.findOne({urlname: 'alpha'}).populate('employees',"username email -_id")
// .then((org)=>{
//     var list = [];
//     org.employees.forEach(guy=>list.push(guy.username));
//     console.log(org.employees)
// })
// .catch(err=>console.log(err))

var PORT = process.env.PORT;
app.all('*', function (req, res) {
  return res.status(404).json({
    message: 'You seem lost... no resource found'
  });
});
app.listen(PORT, process.env.IP, function () {
  console.log("Listening on ".concat(PORT));
});
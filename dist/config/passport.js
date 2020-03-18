"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.passportConfig = void 0;

var _User = require("../models/User");

var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;

var passportConfig = function passportConfig(passport) {
  passport.serializeUser(_User.User.serializeUser());
  passport.deserializeUser(_User.User.deserializeUser());
  passport.use("local", new LocalStrategy(_User.User.authenticate()));
  passport.use(_User.User.createStrategy());
};

exports.passportConfig = passportConfig;
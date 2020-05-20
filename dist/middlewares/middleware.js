"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDIfferenceinDays = exports.orgExists = exports.isAdmin = exports.authUser = exports.checkUrlExists = undefined;

var _Organization = require("../models/Organization");

var response = require("../middlewares/response");

var checkUrlExists = exports.checkUrlExists = function checkUrlExists(url) {
  _Organization.Organization.find({
    urlname: url
  }, function (err, org) {
    if (!org.name === undefined) {
      return true;
    } else {
      return false;
    }
  });
};

var authUser = exports.authUser = function authUser(req, res, next) {
  if (req.user) {
    return next();
  } else {
    return response.error(res, 401, 'You need to be logged in to do this');
  }
};

var isAdmin = exports.isAdmin = function isAdmin(req, res, next) {
  if (req.user.role === "admin") {
    return next();
  } else {
    return res.status(403).render('error/403', {
      message: 'You are unauthorized to do this'
    });
  }
};

var orgExists = exports.orgExists = function orgExists(req, res, next) {
  var urlname = req.params.urlname;

  _Organization.Organization.findOne({
    urlname: urlname
  }, function (err, org) {
    if (org) {
      return next();
    } else {
      response.error(res, 404, "Organization could not be found");
    }
  });
};

var getDIfferenceinDays = exports.getDIfferenceinDays = function getDIfferenceinDays(start, end) {
  var diffInMilliSecs = new Date(end) - new Date(start);
  return diffInMilliSecs / 8.64e+7;
};
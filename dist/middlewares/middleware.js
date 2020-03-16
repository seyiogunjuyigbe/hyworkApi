"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDIfferenceinDays = exports.orgExists = exports.isAdmin = exports.authUser = exports.checkUrlExists = void 0;

var _Organization = require("../models/Organization");

var response = require("../middlewares/response");

var checkUrlExists = function checkUrlExists(url) {
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

exports.checkUrlExists = checkUrlExists;

var authUser = function authUser(req, res, next) {
  if (req.user) {
    return next();
  } else {
    return response.error(res, 401, 'You need to be logged in to do this');
  }
};

exports.authUser = authUser;

var isAdmin = function isAdmin(req, res, next) {
  if (req.user.role === "admin") {
    return next();
  } else {
    return res.status(403).render('error/403', {
      message: 'You are unauthorized to do this'
    });
  }
};

exports.isAdmin = isAdmin;

var orgExists = function orgExists(req, res, next) {
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

exports.orgExists = orgExists;

var getDIfferenceinDays = function getDIfferenceinDays(start, end) {
  var diffInMilliSecs = new Date(end) - new Date(start);
  return diffInMilliSecs / 8.64e+7;
};

exports.getDIfferenceinDays = getDIfferenceinDays;
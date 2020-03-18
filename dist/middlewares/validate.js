"use strict";

var _require = require('express-validator'),
    validationResult = _require.validationResult;

module.exports = function (req, res, next) {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    var error = {};
    errors.array().map(function (err) {
      return error[err.param] = err.msg;
    });
    return res.status(422).json({
      error: error
    });
  }

  next();
};
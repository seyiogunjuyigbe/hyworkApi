"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startDb = void 0;

var _constants = require("../config/constants");

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var startDb = function startDb() {
  var DB_URL;

  if (_constants.MODE == 'LOCAL') {
    DB_URL = _constants.LOCAL_DB_URL;
  } else if (_constants.MODE == 'TEST') {
    DB_URL = _constants.TEST_DB_URL;
  } else if (_constants.MODE == 'PROD') {
    DB_URL = _constants.PROD_DB_URL;
  } else if (_constants.MODE == 'DEV') {
    DB_URL = _constants.DEV_DB_URL;
  }

  mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  }, function (err, done) {
    if (err) {
      console.error(err);
    } else {
      console.log('Database connected to: ' + DB_URL);
    }
  });
};

exports.startDb = startDb;
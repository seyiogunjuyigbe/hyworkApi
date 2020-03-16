"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Location = void 0;

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var locationSchema = new Schema({
  streetAddress: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  zipCode: {
    type: String
  },
  title: {
    type: String
  }
});
var Location = mongoose.model('Location', locationSchema);
exports.Location = Location;
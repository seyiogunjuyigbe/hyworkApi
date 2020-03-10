"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dependent = void 0;

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var dependentSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  relationship: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true
  },
  location: {
    type: location,
    required: true
  }
});
var Dependent = mongoose.model('Dependent', dependentSchema);
exports.Dependent = Dependent;
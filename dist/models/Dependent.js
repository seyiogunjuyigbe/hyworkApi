"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var dependentSchema = exports.dependentSchema = new Schema({
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
    type: Schema.Types.ObjectId,
    ref: 'Location'
  }
});
var Dependent = exports.Dependent = mongoose.model('Dependent', dependentSchema);
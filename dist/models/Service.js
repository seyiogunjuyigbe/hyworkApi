"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var serviceSchema = exports.serviceSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  form: [{
    type: Schema.Types.ObjectId,
    ref: 'Form'
  }]
});
var Service = exports.Service = mongoose.model('Service', serviceSchema);
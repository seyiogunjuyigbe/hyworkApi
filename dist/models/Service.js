"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Service = void 0;

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var serviceSchema = new Schema({
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
var Service = mongoose.model('Service', serviceSchema);
exports.Service = Service;
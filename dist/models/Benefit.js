"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Benefit = void 0;

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var benefitSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  beneficiaries: [{
    type: user
  }]
});
var Benefit = mongoose.model('Benefit', benefitSchema);
exports.Benefit = Benefit;
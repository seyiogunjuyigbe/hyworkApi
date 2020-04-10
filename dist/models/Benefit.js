"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var benefitSchema = exports.benefitSchema = new Schema({
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
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});
var Benefit = exports.Benefit = mongoose.model('Benefit', benefitSchema);
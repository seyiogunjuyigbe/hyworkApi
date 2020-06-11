"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var shiftSchema = exports.shiftSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  isShiftMarginEnabled: {
    type: Boolean,
    "default": false
  },
  startMarginInMinutes: {
    type: Number,
    "default": 0
  },
  endMarginInMinutes: {
    type: String,
    "default": 0
  },
  createdBy: {
    type: String
  },
  createdFor: {
    type: Schema.Types.ObjectId,
    ref: 'Organization'
  }
});
var Shift = exports.Shift = mongoose.model('Shift', shiftSchema);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Timelog = void 0;

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var timeLogSchema = new Schema({
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: user,
    required: true
  },
  location: {
    type: location,
    required: true
  }
});
var Timelog = mongoose.model('Timelog', timeLogSchema);
exports.Timelog = Timelog;
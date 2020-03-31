"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Timelog = exports.timeLogSchema = void 0;

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var mongooseIdToken = require('mongoose-id-token');

var timeLogSchema = new Schema({
  startTime: {
    type: Number,
    required: true
  },
  endTime: {
    type: Number
  },
  hoursWorked: {
    type: Number,
    "default": 0
  },
  description: {
    type: String,
    required: true
  },
  relatedJob: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location'
  }
});
exports.timeLogSchema = timeLogSchema;
var options = {
  fieldName: "token",
  createIndex: true,
  tokenLength: 16
};
timeLogSchema.plugin(mongooseIdToken, options);
var Timelog = mongoose.model('Timelog', timeLogSchema);
exports.Timelog = Timelog;
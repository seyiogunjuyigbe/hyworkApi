"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var mongooseIdToken = require('mongoose-id-token');

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var attendanceSchema = exports.attendanceSchema = new Schema({
  date: {
    type: String,
    required: true
  },
  clockIn: {
    type: String,
    required: true
  },
  clockOut: {
    type: String
  },
  // Early, late, absent
  clockInStatus: {
    type: String
  },
  clockInMargin: String,
  clockOutMargin: String,
  // Closed, Overtime, absent etc
  clockOutStatus: {
    type: String
  },
  user: String,
  shift: {
    type: Schema.Types.ObjectId,
    ref: "Shift"
  },
  seatingLocation: {}
});
var options = {
  fieldName: "token",
  createIndex: true,
  tokenLength: 16
};
attendanceSchema.plugin(mongooseIdToken, options);
var Attendance = exports.Attendance = mongoose.model('Attendance', attendanceSchema);
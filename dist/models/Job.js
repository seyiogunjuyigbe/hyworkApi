"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Job = void 0;

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var jobSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    required: true
  },
  description: {
    type: String
  },
  isBillable: {
    type: Boolean,
    required: true
  },
  hours: {
    type: Number,
    required: true
  },
  ratePerHour: {
    type: Number
  },
  attachment: [{
    type: Schema.Types.ObjectId,
    ref: 'File'
  }],
  workItems: [{
    type: String
  }],
  assignees: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timeLogs: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'TimeLog'
  }]
});
var Job = mongoose.model('Job', jobSchema);
exports.Job = Job;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var taskSchema = exports.taskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  timeAssigned: {
    type: Date
  },
  deadline: {
    type: Date
  },
  assignedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  files: [{
    type: Schema.Types.ObjectId,
    ref: 'File'
  }]
});
var Task = exports.Task = mongoose.model('Task', taskSchema);
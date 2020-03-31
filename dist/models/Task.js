"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Task = exports.taskSchema = void 0;

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var taskSchema = new Schema({
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
exports.taskSchema = taskSchema;
var Task = mongoose.model('Task', taskSchema);
exports.Task = Task;
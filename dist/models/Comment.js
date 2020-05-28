"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var commentSchema = exports.commentSchema = new Schema({
  timeSent: {
    type: String,
    required: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipients: [],
  sentFor: {
    type: Schema.Types.ObjectId,
    ref: 'Case'
  },
  notes: {
    type: String
  },
  assignedTasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }]
});
var Comment = exports.Comment = mongoose.model('Comment', commentSchema);
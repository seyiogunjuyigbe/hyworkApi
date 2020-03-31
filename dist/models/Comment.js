"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Comment = exports.commentSchema = void 0;

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var commentSchema = new Schema({
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
exports.commentSchema = commentSchema;
var Comment = mongoose.model('Comment', commentSchema);
exports.Comment = Comment;
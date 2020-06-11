"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var caseSchema = exports.caseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  reach: {
    type: String,
    "enum": ['Department', 'Organization']
  },
  priority: {
    type: String,
    "enum": ['Low', 'Medium', 'High', 'Urgent']
  },
  description: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  respondents: [{
    type: String,
    required: true
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  status: {
    type: String,
    "enum": ['Pending', 'Unanswered', 'Resolved', 'Unresolved', 'Closed'],
    "default": 'Pending'
  }
});
var Case = exports.Case = mongoose.model('Case', caseSchema);
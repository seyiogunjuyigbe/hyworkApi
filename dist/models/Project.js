"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var projectSchema = exports.projectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  jobs: [{
    type: Schema.Types.ObjectId,
    ref: 'Job'
  }]
});
var Project = exports.Project = mongoose.model('Project', projectSchema);
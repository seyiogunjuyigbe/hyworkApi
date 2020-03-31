"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Project = exports.projectSchema = void 0;

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var projectSchema = new Schema({
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
exports.projectSchema = projectSchema;
var Project = mongoose.model('Project', projectSchema);
exports.Project = Project;
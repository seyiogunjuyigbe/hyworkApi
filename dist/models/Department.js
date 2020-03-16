"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Department = void 0;

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var departmentSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  employees: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  dateCreated: {
    type: Date,
    required: true
  },
  cases: [{
    type: Schema.Types.ObjectId,
    ref: 'Case'
  }]
});
var Department = mongoose.model('Department', departmentSchema);
exports.Department = Department;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Department = exports.departmentSchema = void 0;

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
exports.departmentSchema = departmentSchema;
var Department = mongoose.model('Department', departmentSchema);
exports.Department = Department;
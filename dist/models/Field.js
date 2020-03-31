"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Field = exports.fieldSchema = void 0;

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var fieldSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});
exports.fieldSchema = fieldSchema;
var Field = mongoose.model('Field', fieldSchema);
exports.Field = Field;
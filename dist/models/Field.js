"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Field = void 0;

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
var Field = mongoose.model('Field', fieldSchema);
exports.Field = Field;
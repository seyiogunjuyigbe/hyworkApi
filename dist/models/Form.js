"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Form = exports.formSchema = void 0;

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var formSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  fields: [{
    type: Schema.Types.ObjectId,
    ref: 'Field',
    required: true
  }],
  urlLink: {
    type: String,
    required: true
  }
});
exports.formSchema = formSchema;
var Form = mongoose.model('Form', formSchema);
exports.Form = Form;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var formSchema = exports.formSchema = new Schema({
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
var Form = exports.Form = mongoose.model('Form', formSchema);
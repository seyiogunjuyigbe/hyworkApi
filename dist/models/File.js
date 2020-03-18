"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.File = void 0;

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var fileSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  fileLocationUrl: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});
var File = mongoose.model('File', fileSchema);
exports.File = File;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Token = exports.tokenSchema = void 0;

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var tokenSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    "default": new Date().getTime(),
    expires: 43200
  }
}, {
  timestamps: true
});
exports.tokenSchema = tokenSchema;
var Token = mongoose.model('Token', tokenSchema);
exports.Token = Token;
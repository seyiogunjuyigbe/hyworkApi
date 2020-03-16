"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Token = void 0;

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
    "default": Date.now,
    expires: 43200
  }
}, {
  timestamps: true
});
var Token = mongoose.model('Token', tokenSchema);
exports.Token = Token;
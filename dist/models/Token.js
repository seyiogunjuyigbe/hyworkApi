"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var tokenSchema = exports.tokenSchema = new Schema({
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
var Token = exports.Token = mongoose.model('Token', tokenSchema);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Goal = exports.goalSchema = void 0;

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var goalSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});
exports.goalSchema = goalSchema;
var Goal = mongoose.model('Goal', goalSchema);
exports.Goal = Goal;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var delegationSchema = exports.delegationSchema = new Schema({
  delegatee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  delegator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  delegatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPermanent: {
    type: Boolean,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
});
var Delegation = exports.Delegation = mongoose.model('Delegation', delegationSchema);
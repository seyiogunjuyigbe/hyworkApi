"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Delegation = exports.delegationSchema = void 0;

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var delegationSchema = new Schema({
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
exports.delegationSchema = delegationSchema;
var Delegation = mongoose.model('Delegation', delegationSchema);
exports.Delegation = Delegation;
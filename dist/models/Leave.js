"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Leave = exports.leaveSchema = void 0;

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var mongooseIdToken = require('mongoose-id-token');

var leaveSchema = new Schema({
  dateApplied: {
    type: Date
  },
  title: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  approvalStatus: {
    type: String,
    "enum": ['Pending', 'Approved', 'Declined'],
    "default": 'Pending',
    required: true
  },
  applicant: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  declinedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});
exports.leaveSchema = leaveSchema;
var options = {
  fieldName: "token",
  createIndex: true,
  tokenLength: 8
};
leaveSchema.plugin(mongooseIdToken, options);
var Leave = mongoose.model('Leave', leaveSchema);
exports.Leave = Leave;
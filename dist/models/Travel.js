"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Travel = void 0;

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var travelSchema = new Schema({
  placeOfVisit: {
    type: String,
    required: true
  },
  departureDate: {
    type: Date,
    required: true
  },
  arrivalDate: {
    type: Date,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  isBillableToCustomer: {
    type: Boolean,
    required: true,
    "default": false
  },
  customerName: {
    type: String
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: String,
    required: true
  },
  modifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  modifiedAt: {
    type: String
  },
  approvalStatus: {
    type: String,
    required: true,
    "enum": ['Pending', 'Approved', 'Declined'],
    "default": 'Pending'
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  requestor: {
    type: String,
    required: true
  },
  numberOfDays: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});
var Travel = mongoose.model('Travel', travelSchema);
exports.Travel = Travel;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var travelSchema = new Schema({
  employeeId: {
    type: String,
    required: true
  },
  employeeDepartment: {
    type: department,
    required: true
  },
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
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  addedAt: {
    type: String,
    required: true
  },
  modifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  modifiedAt: {
    type: String,
    required: true
  },
  approvalStatus: {
    type: String,
    required: true
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  requestor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

export const Travel = mongoose.model('Travel', travelSchema)
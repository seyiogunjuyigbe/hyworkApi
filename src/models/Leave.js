
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const leaveSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  period: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  approvalStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Declined'],
    default: 'Pending',
    required: true
  },
  applicant: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

export const Leave = mongoose.model('Leave', leaveSchema)
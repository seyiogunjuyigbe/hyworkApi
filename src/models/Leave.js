
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
    required: true
  },
  applicant: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

export const Leave = mongoose.model('Leave', leaveSchema)
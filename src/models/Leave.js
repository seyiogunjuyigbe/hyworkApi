
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseIdToken = require('mongoose-id-token')
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
  },
  declinedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});
var options = {
  fieldName: "token",
  createIndex: true,
  tokenLength: 8
}
leaveSchema.plugin(mongooseIdToken, options);
export const Leave = mongoose.model('Leave', leaveSchema)
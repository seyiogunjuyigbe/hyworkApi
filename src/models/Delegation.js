
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const delegationSchema = new Schema({
  delegatee: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true
  },
  delegator: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true
  },
  delegatedBy: {
    type: Schema.Types.ObjectId,
    ref: User,
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

export const Delegation = mongoose.model('Delegation', delegationSchema)
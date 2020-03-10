const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const benefitSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  beneficiaries: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

export const Benefit = mongoose.model('Benefit', benefitSchema)

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const goalSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
  
  },
  status: {
    type: String,
    required: true
  },
  user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
  }
});

export const Goal = mongoose.model('Goal', goalSchema);
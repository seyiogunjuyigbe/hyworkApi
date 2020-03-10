const mongoose = require('mongoose');
const Schema = mongoose.Schema;
export const timeLogSchema = new Schema({
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: user,
    required: true
  },
  location: {
    type: location,
    required: true
  }
});
export const Timelog = mongoose.model('Timelog', timeLogSchema)
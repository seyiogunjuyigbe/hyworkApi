
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shiftSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  isShiftMarginEnabled: {
    type: Boolean,
  },
  startMarginInMinutes: {
    type: Number,
    default: 0
  },
  endMarginInMinutes: {
    type: String,
  },
  createdBy: {
    type: String,
    required: true
  }
});

export const Shift = mongoose.model('Shift', shiftSchema);
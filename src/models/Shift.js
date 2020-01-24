
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
    required: true
  },
  startMargin: {
    type: String,
    required: true
  },
  endMargin: {
    type: String,
    required: true
  }
});

export const Shift = mongoose.model('Shift', shiftSchema);
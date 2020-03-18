const mongoose = require('mongoose');
const Schema = mongoose.Schema;
export const fieldSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

export const Field = mongoose.model('Field', fieldSchema)
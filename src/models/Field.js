
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fieldSchema = new Schema({
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
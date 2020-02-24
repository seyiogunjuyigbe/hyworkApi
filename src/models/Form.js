
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const formSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  fields: [{
    type: Schema.Types.ObjectId,
    ref: Field,
    required: true
  }],
  urlLink: {
    type: String,
    required: true
  }
});

export const Form = mongoose.model('Form', formSchema)
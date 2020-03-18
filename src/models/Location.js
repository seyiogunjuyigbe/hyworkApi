const mongoose = require('mongoose');
const Schema = mongoose.Schema;
export const locationSchema = new Schema({
  streetAddress: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  zipCode: {
    type: String
  },
  title: {
    type: String
  }
});

export const Location = mongoose.model('Location', locationSchema);
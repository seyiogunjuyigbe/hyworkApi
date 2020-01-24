
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dependentSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  relationship: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
  
  },
  location: {
    type: location,
    required: true
  }
});

export const Dependent = mongoose.model('Dependent', dependentSchema)
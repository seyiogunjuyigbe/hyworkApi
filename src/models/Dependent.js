
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dependentSchema = new Schema({
  firstName: {
    type: String,
    required: true, 
    trim: true
  },
  lastName: {
    type: String,
    required: true, 
    trim: true
  },
  relationship: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true
  
  },
  location: {
    type: location,
    required: true
  }
});

export const Dependent = mongoose.model('Dependent', dependentSchema)
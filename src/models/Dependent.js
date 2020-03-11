const mongoose = require('mongoose');
const Schema = mongoose.Schema;
export const dependentSchema = new Schema({
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
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  }
});

export const Dependent = mongoose.model('Dependent', dependentSchema)
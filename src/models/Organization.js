
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var organizationSchema = new Schema({
    name: {
    type: String,
    required: true
  },
  location: [{
    type: location,
  }],
  description: {
    type: String
  },
  category: {
    type: "String"
    
  },
  admin: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }],
  employees: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  telephone: {
    type: String,
    required: true
  },
  staffStength: {
    type: Number
  },

  services: [{
    type: Schema.Types.ObjectId,
    ref: 'Service'
  }],
  forms: [{
    type: Schema.Types.ObjectId,
    ref: 'Form'
  }],
  files: [{
    type: Schema.Types.ObjectId,
    ref: 'File'
  }]
});

export const Organization = mongoose.model('Organization', organizationSchema)
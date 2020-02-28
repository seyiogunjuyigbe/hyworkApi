
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var organizationSchema = new Schema({
    name: {
    type: String,
    required: true
  },
  location: [{
    type: Schema.Types.ObjectId,
    ref:'Location'

  }],
  description: {
    type: String
  },
  urlname: {
    type: String,
    trim: true, 
    required: true,
    unique: true
  },
  category: {
    type: "String"
    
  },
  admin: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  employees: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  telephone: {
    type: String,
  },
  staffStength: {
    type: Number
  },
  department: [{
    type: Schema.Types.ObjectId,
    ref: 'Department'
  }],
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
  }],
  attendance: [{
    type: Schema.Types.ObjectId,
    ref: 'Attendance'
  }]
});

// organizationSchema.pre('save', function(next) {
//   const org = this;

//   if (org.isModified()
// })

export const Organization = mongoose.model('Organization', organizationSchema)
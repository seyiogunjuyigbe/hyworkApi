
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
  // this was changed to a plain array so that the org.admin.includes() function works without hitches.
  // a mongoose approach will be to use the $in query but I'm not sure how that will play out
  admin: [],
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
  shifts: [{
    type: Schema.Types.ObjectId,
    ref: 'Shift'
  }],
  attendance: [{
    type: Schema.Types.ObjectId,
    ref: 'Attendance'
  }],
  leaves:[{
    type: Schema.Types.ObjectId,
    ref: 'Leave'
  }],
  cases: [{
    type: Schema.Types.ObjectId,
    ref: 'Case'
  }]
});

// organizationSchema.pre('save', function(next) {
//   const org = this;

//   if (org.isModified()
// })

export const Organization = mongoose.model('Organization', organizationSchema)
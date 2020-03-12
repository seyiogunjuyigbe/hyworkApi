
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var jobSchema = new Schema({
  title: {
    type: String,
    
    required: true
  },
  dateCreated: {
    type: Date,
    required: true
  },
  description: {
    type: String
  },
  isBillable: {
    type: Boolean,
    required: true,
    default: false
  },
  hours: {
    type: Number,
    required: true
  },
  ratePerHour: {
    type: Number,
    default: 0
  },
  attachment: [{
    type: Schema.Types.ObjectId,
    ref: 'File'
  }],
  workItems: [{
      type: String
  }],
  assignees: [],
  createdBy: {
    type: String,
    required: true
  },
  timeLogs: [{
    type: Schema.Types.ObjectId,
    ref: 'TimeLog'
  }]
});
 
export const Job = mongoose.model('Job', jobSchema)
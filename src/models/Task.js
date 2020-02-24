
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var taskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  timeAssigned: {
    type: String,
    required: true
  },
  deadline: {
    type: String,
    required: true
  },
  assignedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  files: [{
    type: Schema.Types.ObjectId,
    ref: 'File'
  }]
});

export const Task = mongoose.model('Task', taskSchema)
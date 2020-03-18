const mongoose = require('mongoose');
const Schema = mongoose.Schema;
export const taskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  timeAssigned: {
    type: Date
  },
  deadline: {
    type: Date,
  },
  assignedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  files: [{
    type: Schema.Types.ObjectId,
    ref: 'File'
  }]
});

export const Task = mongoose.model('Task', taskSchema)
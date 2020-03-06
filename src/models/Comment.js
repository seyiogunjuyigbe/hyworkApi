
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = new Schema({
  timeSent: {
    type: String,
    required: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipients: [],
  sentFor: {
        type: Schema.Types.ObjectId,
        ref: 'Case'
  },
  notes: {
    type: String,
  },
  assignedTasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }]
});

export const Comment = mongoose.model('Comment', commentSchema)
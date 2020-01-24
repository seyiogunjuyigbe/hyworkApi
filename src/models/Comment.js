
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = new Schema({
  timeSent: {
    type: String,
    required: true
  },
  sender: {
    type: user,
    required: true
  },
  recipient: {
    type: user,
    required: true
  },
  sentFor: {
        type: Schema.Types.ObjectId,
        ref: 'Case'
  },
  notes: {
    type: String,
  },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }]
});

export const Comment = mongoose.model('Comment', commentSchema)
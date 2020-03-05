
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const caseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  reach: {
    type:String,
    enum: ['Department','Organization']
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent']
  },
  description: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  respondents: [{
    type: String,
    required: true, 
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
 status: {
type: String,
enum: ['Pending', 'Unanswered', 'Resolved', 'Unresolved', 'Closed'],
default: 'Pending'
 }
});

export const Case = mongoose.model('Case', caseSchema)
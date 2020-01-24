
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const caseSchema = new Schema({
  subject: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdBy: {
    type: user,
    required: true
  },
  respondents: {
    type: user,
    required: true, 
    comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
  }
 
});

export const Case = mongoose.model('Case', caseSchema)
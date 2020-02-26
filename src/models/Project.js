
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var projectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  jobs: [{
    type: Schema.Types.ObjectId,
    ref: 'Job'
  }]
});

export const Project = mongoose.model('Project', projectSchema)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseIdToken = require('mongoose-id-token')
export const projectSchema = new Schema({
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
var options = {
  fieldName: "token",
  createIndex: true,
  tokenLength: 8
}
projectSchema.plugin(mongooseIdToken, options)
export const Project = mongoose.model('Project', projectSchema)
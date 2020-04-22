const mongoose = require('mongoose');
const Schema = mongoose.Schema;
export const fileSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  fileLocationUrl: {
    type: String,
    required: true
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Department'
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});
export const File = mongoose.model('File', fileSchema);
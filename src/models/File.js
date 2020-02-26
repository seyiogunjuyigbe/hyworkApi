const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fileSchema = new Schema({
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
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});
export const File = mongoose.model('File', fileSchema);
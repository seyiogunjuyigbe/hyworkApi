
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var assetSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,

  },
  acquiredBy: {
    type: String,
      },
  dateAcquired: {
    type: Date,
      },
  dateReleased: {
    type: Date
  }
});

export const Asset = mongoose.model('Asset', assetSchema)
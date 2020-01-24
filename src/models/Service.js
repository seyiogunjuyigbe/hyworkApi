
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var serviceSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  form: [{
    type: Schema.Types.ObjectId,
    ref: 'Form'
  }]
});

export const Service = mongoose.model('Service', serviceSchema)
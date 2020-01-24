
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  message: {
    type: String,
    required: true
  },
  isSent: {
    type: Boolean,
    required: true
  },
  isDelivered: {
    type: Boolean,
    required: true
  },
  isRead: {
    type: Boolean,
    required: true
  },
  timeSent: {
    type: String,
  },
  timeDelivered: {
    type: String,
  },
  timeRead: {
    type: String,
  }
});
export const Message = mongoose.model('Message', messageSchema)
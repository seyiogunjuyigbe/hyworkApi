
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const attendanceSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  timeLoggedIn: {
    type: String,
    required: true
  },
  timeLoggedOut: {
    type: String,
    
  },
  user: {
    type: user,
    required: true
  },
  seatingLocation: {
    type: location,
    required: true
  }
});

export const Attendance = mongoose.model('Attendance', attendanceSchema)

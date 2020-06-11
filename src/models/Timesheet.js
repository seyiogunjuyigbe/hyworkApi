
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const mongooseIdToken = require('mongoose-id-token');
export const timesheetSchema = new Schema({
startDate:{
    type: Date,
    required: true
},
endDate:{
    type: Date,
    required: true
},
owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
logs:[{
    type: Schema.Types.ObjectId,
    ref: 'Timelog'
}],
approvalStatus:{
    type: String,
    enum:['pending', 'approved', 'rejected'],
    default: 'pending'
},
responseDate: Date // date when approved or rejected
})
var options = {
    fieldName: "token",
    createIndex: true,
    tokenLength: 8
  }
timesheetSchema.plugin(mongooseIdToken, options)
export const Timesheet = mongoose.model('Timesheet', timesheetSchema)
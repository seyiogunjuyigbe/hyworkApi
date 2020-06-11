const mongoose = require('mongoose');
const Schema = mongoose.Schema;
export const feedbackSchema = new Schema({
employee_id: String,
goal: {
    type: Schema.Types.ObjectId,
    ref: 'Goal'
},
comment: String,
commenter: {
    type: Schema.Types.ObjectId,
    ref: 'User'
}
})
export const Feedback = mongoose.model('Feedback',feedbackSchema)
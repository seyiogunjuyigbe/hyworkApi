const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseIdToken = require('mongoose-id-token')
export const ratingSchema = new Schema({
    employee_id: String,
    type: {
        type: String
    },
    value: Number,
    cycle_token: String,
    assessor_id: String,
})
let options = {
    fieldName: 'token',
    length: 8
}
ratingSchema.plugin(mongooseIdToken,options)
export const Rating = mongoose.model('Rating', ratingSchema)
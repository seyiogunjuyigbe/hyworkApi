const mongoose = require('mongoose');
const Schema = mongoose.Schema;
export const roleSchema = new Schema({
    title: {type: String, uppercase: true},
    description: String,
})
export const Role = mongoose.model('Role', roleSchema)
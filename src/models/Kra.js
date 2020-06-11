const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseIdToken = require('mongoose-id-token')
export const kraSchema = new Schema({
employees: [],
title: {type:String, required: true},
description: String,
weightage: {type: Number, default:0},
created_by: String,
token: String
})
kraSchema.plugin(mongooseIdToken, {fieldName: 'token', tokenLength: 8})
export const Kra = mongoose.model('Kra',kraSchema)
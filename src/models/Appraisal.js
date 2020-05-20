const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseIdToken = require('mongoose-id-token')
export const appraisalSchema = new Schema({
title: {type: String, required: true},
startDate: {type: Date, required: true},
endDate: {type: Date, required: true},
description: String, 
created_by: String,
guideline: String,
process_period_start: {type: Date, required: true},
process_period_end: {type: Date, required: true},
self_appraisal_enabled: {type: Boolean, default: false},
self_appraisal_start: Date,
max:{type: Number, required: true},
self_appraisal_end: Date,
multi_rater_feedback_enabled: {type: Boolean, default: false},
multi_rater_selection_period_start: Date,
multi_rater_selection_period_end: Date,
multi_rater_feedback_period_start: Date,
multi_rater_feedback_period_end: Date,
auto_reviewer_as_assessor:{type: Boolean, default: false},
assessor_selector:{
    type: String,
    enum:['manager','any'],
},
employees: [{
  type: Schema.Types.ObjectId,
  ref: 'User'
}],
no_of_assessors: Number,
hide_assessors: {type: Boolean, default: false},
review_period_start:Date,
review_period_end: Date,
status: String,
token: String,
  })
  appraisalSchema.plugin(mongooseIdToken, {fieldName: 'token', length: 8});
  export const Appraisal = mongoose.model('Appraisal', appraisalSchema)
const mongoose = require("mongoose");
const Schema = mongoose.Schema
export const assetSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  acquiredBy: {
    type: String
  },
  modifiedBy: String,
  dateAcquired: {
    type: Date
  },
  dateReleased: {
    type: Date
  },
  createdBy:{
    type: String,
    required: true
  }
},
  {timestamps:true});

export const Asset = mongoose.model("Asset", assetSchema);

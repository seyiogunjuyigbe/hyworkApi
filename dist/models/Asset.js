"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var assetSchema = exports.assetSchema = new Schema({
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
  createdBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
var Asset = exports.Asset = mongoose.model("Asset", assetSchema);
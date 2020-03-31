"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Asset = exports.assetSchema = void 0;

var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var assetSchema = new Schema({
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
exports.assetSchema = assetSchema;
var Asset = mongoose.model("Asset", assetSchema);
exports.Asset = Asset;
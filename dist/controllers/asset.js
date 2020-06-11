"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteAsset = exports.modifyAsset = exports.createAsset = undefined;

var _Asset = require("../models/Asset");

var _Organization = require("../models/Organization");

var _User = require("../models/User");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var response = require('../middlewares/response'); // Assign a company asset to an employee and create records for it
// @POST /org/:urlame/asset/new
// Access: loggde in admin
// req.body:  title, type, description, acquiredBy, dateAcquired,dateReleased


var createAsset = exports.createAsset = function createAsset(req, res) {
  var _req$dbModels = req.dbModels,
      Asset = _req$dbModels.Asset,
      TenantOrganization = _req$dbModels.TenantOrganization,
      User = _req$dbModels.User;
  TenantOrganization.findOne({
    urlname: req.params.urlname
  }).populate("employees", "username -_id").then(function (org) {
    var list = [];
    org.employees.forEach(function (employee) {
      return list.push(employee.username);
    });

    if (!list.includes(req.body.acquiredBy)) {
      console.log(list);
      return response.error(res, 422, 'This employee does not exist');
    } else if (new Date(req.body.dateAcquired).getTime() >= new Date(req.body.dateReleased).getTime()) {
      return response.error(res, 422, 'Release date must be later than acquired date');
    } else {
      User.findOne({
        username: req.body.acquiredBy
      }, function (err, user) {
        if (err) return response.error(res, 500, err.message);else if (!user) return response.error(res, 404, 'User does not exist');else {
          Asset.create(_objectSpread({}, req.body, {
            createdBy: req.user.username
          }), function (err, asset) {
            if (err) return response.error(res, 500, err.message);else {
              asset.save();
              user.assets.push(asset);
              user.save();
              org.assets.push(asset);
              org.save();
              response.success(res, 200, 'Asset record added successfully');
            }
          });
        }
      });
    }
  })["catch"](function (err) {
    response.error(res, 500, err.message);
  });
};

var modifyAsset = exports.modifyAsset = function modifyAsset(req, res) {
  var _req$dbModels2 = req.dbModels,
      Asset = _req$dbModels2.Asset,
      TenantOrganization = _req$dbModels2.TenantOrganization,
      User = _req$dbModels2.User;
  TenantOrganization.findOne({
    urlname: req.params.urlname
  }).populate("employees", "username -_id").then(function (org) {
    var list = [];
    org.employees.forEach(function (employee) {
      return list.push(employee.username);
    });

    if (!list.includes(req.body.acquiredBy)) {
      console.log(list);
      return response.error(res, 422, 'This employee does not exist');
    } else if (new Date(req.body.dateAcquired).getTime() >= new Date(req.body.dateReleased).getTime()) {
      return response.error(res, 422, 'Release date must be later than acquired date');
    } else {
      User.findOne({
        username: req.body.acquiredBy
      }, function (err, user) {
        if (err) return response.error(res, 500, err.message);else if (!user) return response.error(res, 404, 'User does not exist');else {
          Asset.findOneAndUpdate({
            _id: req.params.asset_id
          }, _objectSpread({}, req.body, {
            modifiedBy: req.user.username
          }), function (err, asset) {
            if (err) return response.error(res, 500, err.message);else if (!asset) return response.error(res, 404, 'Asset not found');else {
              asset.save();
              response.success(res, 200, asset);
            }
          });
        }
      });
    }
  })["catch"](function (err) {
    response.error(res, 500, err.message);
  });
};

var deleteAsset = exports.deleteAsset = function deleteAsset(req, res) {
  var Asset = req.dbModels.Asset;
  Asset.findByIdAndDelete(req.params.asset_id, function (err, asset) {
    if (err) return response.error(res, 500, err.message);else if (!asset) return response.error(res, 404, 'Asset not found');else {
      response.success(res, 200, 'Asset record deleted successfully');
    }
  });
};
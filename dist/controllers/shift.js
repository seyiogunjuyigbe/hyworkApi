"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteShift = exports.fetchShifts = exports.updateShift = exports.createShift = undefined;

var _User = require("../models/User");

var _Organization = require("../models/Organization");

var _TenantModels = require("../models/TenantModels");

var _attendanceCalc = require("../middlewares/attendanceCalc");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// create a workshift schedule
// @POST /:urlname/shifts/new
// Access: Admin
var createShift = exports.createShift = function createShift(req, res) {
  // Fetch Organization
  var _req$dbModels = req.dbModels,
      TenantOrganization = _req$dbModels.TenantOrganization,
      Shift = _req$dbModels.Shift;
  TenantOrganization.findOne({
    urlname: req.params.urlname
  }, function (err, org) {
    if (!req.user) {
      return res.status(401).json({
        message: 'You need to be logged in'
      });
    } else if (err) {
      return res.status(500).json({
        message: err.message
      });
    } else if (!org) {
      return res.status(404).json({
        message: 'No organization with this name was found... please check again'
      });
    } else if (!org.admin.includes(req.user._id)) {
      return res.status(401).json({
        message: 'You are unauthorized to create a shift'
      });
    } else {
      var timeDiff = (0, _attendanceCalc.calcTimeDiffWithoutSec)(req.body.startTime, req.body.endTime);

      if (timeDiff <= 0) {
        return res.status(422).json({
          success: false,
          message: 'Shift end time can not be earlier than start time'
        });
      } else {
        Shift.create(_objectSpread({}, req.body), function (err, shift) {
          if (err) {
            return res.status(500).json({
              message: err.message
            });
          } else {
            shift.createdBy = req.user._id;
            shift.createdFor = org;
            shift.save();
            org.shifts.push(shift);
            org.save();
            return res.status(200).json({
              message: 'Shift created successfully and saved to organization'
            });
          }
        });
      }
    }
  });
}; // Update shift


var updateShift = exports.updateShift = function updateShift(req, res) {
  console.log(req.params);
  var _req$dbModels2 = req.dbModels,
      TenantOrganization = _req$dbModels2.TenantOrganization,
      Shift = _req$dbModels2.Shift;
  TenantOrganization.findOne({
    urlname: req.params.urlname
  }, function (err, org) {
    if (!req.user) {
      return res.status(401).json({
        message: 'You need to be logged in'
      });
    } else if (err) {
      return res.status(500).json({
        message: err.message
      });
    } else if (!org) {
      return res.status(404).json({
        message: 'No organization with this name was found... please check again'
      });
    } else if (!org.admin.includes(req.user._id)) {
      return res.status(401).json({
        message: 'You are unauthorized to edit a shift'
      });
    } else {
      var timeDiff = (0, _attendanceCalc.calcTimeDiffWithoutSec)(req.body.startTime, req.body.endTime);

      if (timeDiff <= 0) {
        return res.status(422).json({
          success: false,
          message: 'Shift end time can not be earlier than start time'
        });
      } else {
        Shift.findByIdAndUpdate(req.params.shift_id, _objectSpread({}, req.body), function (err, shift) {
          if (err) {
            return res.status(500).json({
              message: err.message
            });
          } else if (String(shift.createdBy) !== String(req.user._id)) {
            return res.status(401).json({
              message: 'You cannot edit this shift'
            });
          } else {
            shift.createdFor = org;
            shift.save();
            return res.status(200).json({
              message: 'Shift updated successfully and saved to organization'
            });
          }
        });
      }
    }
  });
};

var fetchShifts = exports.fetchShifts = function fetchShifts(req, res) {
  var _req$dbModels3 = req.dbModels,
      TenantOrganization = _req$dbModels3.TenantOrganization,
      Shift = _req$dbModels3.Shift;
  TenantOrganization.findOne({
    urlname: req.params.urlname
  }, function (err, org) {
    if (!req.user) {
      return res.status(401).json({
        message: 'You need to be logged in'
      });
    } else if (err) {
      return res.status(500).json({
        message: err.message
      });
    } else if (!org) {
      return res.status(404).json({
        params: req.params,
        message: 'No organization with this name was found... please check again'
      });
    } else if (!org.admin.includes(req.user._id)) {
      return res.status(401).json({
        message: 'You are unauthorized to fetch shifts'
      });
    } else {
      Shift.find({
        createdFor: org._id
      }, function (err, shifts) {
        if (err) return res.status(500).json({
          message: err.message
        });else if (!shifts) return res.status(404).json({
          message: 'No shifts found for this organzation'
        });else return res.status(200).json({
          shifts: shifts
        });
      });
    }
  });
};

var deleteShift = exports.deleteShift = function deleteShift(req, res) {
  console.log(req.params);
  var _req$dbModels4 = req.dbModels,
      TenantOrganization = _req$dbModels4.TenantOrganization,
      Shift = _req$dbModels4.Shift;
  TenantOrganization.findOne({
    urlname: req.params.urlname
  }, function (err, org) {
    if (!req.user) {
      return res.status(401).json({
        message: 'You need to be logged in'
      });
    } else if (err) {
      return res.status(500).json({
        message: err.message
      });
    } else if (!org) {
      return res.status(404).json({
        message: 'No organization with this name was found... please check again'
      });
    } else if (!org.admin.includes(req.user._id)) {
      return res.status(401).json({
        message: 'You are unauthorized to delete a shift'
      });
    } else {
      Shift.findByIdAndDelete(req.params.shift_id, function (err, shift) {
        if (err) {
          return res.status(500).json({
            message: err.message
          });
        } else if (String(shift.createdBy) !== String(req.user._id)) {
          return res.status(401).json({
            message: 'You cannot delete this shift'
          });
        } else {
          return res.status(200).json({
            message: 'Shift deleted successfully'
          });
        }
      });
    }
  });
};
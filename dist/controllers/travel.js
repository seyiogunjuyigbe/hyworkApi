"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.declineTravelRequest = exports.approveTravelRequest = exports.updateTravelRecord = exports.createTravelRecord = void 0;

var _Travel = require("../models/Travel");

var _User = require("../models/User");

var _Organization = require("../models/Organization");

var _constants = require("../config/constants");

var _mail = require("../middlewares/mail");

var _middleware = require("../middlewares/middleware");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var response = require('../middlewares/response');

// Create a travel request record
var createTravelRecord = function createTravelRecord(req, res) {
  var _req$dbModels = req.dbModels,
      Travel = _req$dbModels.Travel,
      TenantOrganization = _req$dbModels.TenantOrganization,
      User = _req$dbModels.User;

  if (new Date(req.body.departureDate).getTime() >= new Date(req.body.arrivalDate).getTime()) {
    return response.error(res, 422, 'arrival date must be later than departure date');
  } else if (new Date(req.body.departureDate).getTime() <= new Date().getTime()) {
    return response.error(res, 422, 'departure date can not be earlier than today');
  } else if (!!req.body.isBillableToCustomer && Boolean(req.body.isBillableToCustomer) == true && !req.body.customerName) {
    return response.error(res, 422, 'Please fill in customer name');
  }

  TenantOrganization.findOne({
    urlname: req.params.urlname
  }).then(function (org) {
    User.findOne({
      username: req.body.requestor
    }, function (err, thisUser) {
      if (err) return response.error(res, 500, err.message);else if (!thisUser || !org.employees.includes(thisUser._id)) return response.error(res, 404, 'User not found');else {
        Travel.create(_objectSpread({}, req.body, {
          createdBy: req.user,
          createdAt: new Date().toTimeString(),
          numberOfDays: (0, _middleware.getDIfferenceinDays)(req.body.departureDate, req.body.arrivalDate)
        }), function (err, travel) {
          if (err) return response.error(res, 500, err.message);else {
            travel.save();
            org.travels.push(travel);
            thisUser.travels.push(travel);
            thisUser.save();
            org.save();
            return response.success(res, 200, travel);
          }
        });
      }
    });
  })["catch"](function (err) {
    return response.error(res, 500, err.message);
  });
}; // Update travel request records


exports.createTravelRecord = createTravelRecord;

var updateTravelRecord = function updateTravelRecord(req, res) {
  var _req$dbModels2 = req.dbModels,
      Travel = _req$dbModels2.Travel,
      TenantOrganization = _req$dbModels2.TenantOrganization,
      User = _req$dbModels2.User;
  User.findOne({
    username: req.body.requestor
  }).then(function (user) {
    if (!user) response.error(res, 404, 'User not found for this travel record');else {
      Travel.findByIdAndUpdate(req.params.travel_id, _objectSpread({}, req.body, {
        numberOfDays: (0, _middleware.getDIfferenceinDays)(req.body.departureDate, req.body.arrivalDate),
        modifiedBy: req.user,
        modifiedAt: new Date().toTimeString()
      }), function (err, travel) {
        if (err) return response.error(res, 500, err.message);else if (!travel) response.error(res, 404, 'Travel record not found');else {
          travel.save();
          return response.success(res, 200, 'Travel record updated sucessfully');
        }
      });
    }
  });
};

exports.updateTravelRecord = updateTravelRecord;

var approveTravelRequest = function approveTravelRequest(req, res) {
  var _req$dbModels3 = req.dbModels,
      Travel = _req$dbModels3.Travel,
      TenantOrganization = _req$dbModels3.TenantOrganization,
      User = _req$dbModels3.User;
  TenantOrganization.findOne({
    urlname: req.params.urlname
  }, function (err, org) {
    if (err) return response.error(res, 500, err.message);else if (!org) return response.error(res, 404, 'Organization not found');else {
      Travel.findById(req.params.travel_id, function (err, travel) {
        if (err) return response.error(res, 500, err.message);else if (!travel) response.error(res, 404, 'Travel record not found');else if (travel.approvalStatus !== 'Pending') return response.error(res, 403, 'This request has been responded to already');else {
          User.findOne({
            username: travel.requestor
          }).then(function (thisUser) {
            if (!thisUser) response.error(res, 404, 'User not found for this travel record');else if (thisUser.username == req.user.username) return response.error(res, 403, 'You are not authorized to accept this request');else {
              travel.approvalStatus = 'Approved';
              travel.modifiedBy = req.user;
              travel.modifiedAt = new Date().toTimeString();
              travel.save();
              var mailOptions = {
                from: _constants.MAIL_SENDER,
                to: thisUser.email,
                subject: "Your travel request has been approved",
                html: " Dear ".concat(thisUser.firstName, " ").concat(thisUser.lastName, ", your travel request has been approved!        \n                            <a href=\"http://").concat(req.headers.host, "/org/").concat(org.urlname, "/travel/").concat(travel._id, "/view\" style=\"font-family:candara;font-size:1.2em\">Click to view travel details</a>\n                                ")
              };
              (0, _mail.sendMailToTheseUsers)(req, res, mailOptions);
              return response.success(res, 200, 'Travel record approved');
            }
          })["catch"](function (err) {
            return response.error(res, 500, err.message);
          });
        }
      });
    }
  });
};

exports.approveTravelRequest = approveTravelRequest;

var declineTravelRequest = function declineTravelRequest(req, res) {
  var _req$dbModels4 = req.dbModels,
      Travel = _req$dbModels4.Travel,
      TenantOrganization = _req$dbModels4.TenantOrganization,
      User = _req$dbModels4.User;
  TenantOrganization.findOne({
    urlname: req.params.urlname
  }, function (err, org) {
    if (err) return response.error(res, 500, err.message);else if (!org) return response.error(res, 404, 'Organization not found');else {
      Travel.findById(req.params.travel_id, function (err, travel) {
        if (err) return response.error(res, 500, err.message);else if (!travel) response.error(res, 404, 'Travel record not found');else if (travel.approvalStatus !== 'Pending') return response.error(res, 403, 'This request has been responded to already');else {
          User.findOne({
            username: travel.requestor
          }).then(function (thisUser) {
            if (!thisUser) response.error(res, 404, 'User not found for this travel record');else if (thisUser.username == req.user.username) return response.error(res, 403, 'You are not authorized to accept this request');else {
              travel.approvalStatus = 'Declined';
              travel.modifiedBy = req.user;
              travel.modifiedAt = new Date().toTimeString();
              travel.save();
              var mailOptions = {
                from: _constants.MAIL_SENDER,
                to: thisUser.email,
                subject: "Your travel request has been declined",
                html: " Dear ".concat(thisUser.firstName, " ").concat(thisUser.lastName, ",sorry, your travel request has been declined...        \n                            <a href=\"http://").concat(req.headers.host, "/org/").concat(org.urlname, "/travel/").concat(travel._id, "/view\" style=\"font-family:candara;font-size:1.2em\">Click to view travel details</a>\n                                ")
              };
              (0, _mail.sendMailToTheseUsers)(req, res, mailOptions);
              return response.success(res, 200, 'Travel record declined');
            }
          })["catch"](function (err) {
            return response.error(res, 500, err.message);
          });
        }
      });
    }
  });
};

exports.declineTravelRequest = declineTravelRequest;
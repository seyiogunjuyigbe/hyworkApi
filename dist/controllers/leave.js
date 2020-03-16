"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.declineLeave = exports.approveLeave = exports.createLeaveRequest = void 0;

var _User = require("../models/User");

var _Organization = require("../models/Organization");

var _Leave = require("../models/Leave");

var _Department = require("../models/Department");

var _constants = require("../config/constants");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var validate = require('../middlewares/validate');

var _require = require('express-validator'),
    check = _require.check,
    validationResult = _require.validationResult;

var nodemailer = require('nodemailer');

var response = require('../middlewares/response');

var createLeaveRequest = function createLeaveRequest(req, res) {
  if (!req.user) return response.error(res, 401, 'You need to be signed in');else {
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      var error = [];
      errors.array().map(function (err) {
        return error.push(err.msg);
      });
      return res.status(422).json({
        error: error
      });
    } else {
      if (new Date(req.body.startDate).getTime() >= new Date(req.body.endDate).getTime()) {
        return response.error(res, 422, 'End date must be later than start date');
      } else if (new Date(req.body.startDate).getTime() <= new Date().getTime()) {
        return response.error(res, 422, 'Start date can not be earlier than today');
      } else {
        _Organization.Organization.findOne({
          urlname: req.params.urlname
        }, function (err, org) {
          if (err) return response.error(res, 500, err.message);else if (!org) {
            console.log(req.params);
            return response.error(res, 404, 'Organization not found');
          } else {
            var today = new Date();

            _Leave.Leave.create(_objectSpread({}, req.body, {
              dateApplied: new Date(),
              applicant: req.user
            }), function (err, leave) {
              if (err) return response.error(res, 500, err.message);else {
                leave.save();
                org['leaves'].push(leave);
                org.save();

                _Department.Department.findOne({
                  employees: {
                    $in: req.user._id
                  }
                }).populate('manager').exec(function (err, department) {
                  if (err) return response.error(res, 500, err.message);else if (!department) response.error(res, 404, 'Department not found');else if (!department.employees.includes(req.user._id)) {
                    return response.error(res, 401, 'You do not belong to any department in this organization');
                  } else {
                    if (!department.manager) return response.error(res, 404, 'Manager not found');else {
                      var transporter = nodemailer.createTransport({
                        service: _constants.MAIL_SERVICE,
                        auth: {
                          user: _constants.MAIL_USER,
                          pass: _constants.MAIL_PASS
                        }
                      });
                      var mailOptions = {
                        from: _constants.MAIL_SENDER,
                        to: department.manager.email,
                        subject: "Leave Notice",
                        html: "<h2>Hi ".concat(department.manager.username, " </h2>\n,\n            <p>A leave request has been received from ").concat(req.user.firstName, " ").concat(req.user.lastName, "</p>\n            <a href=\"http://").concat(req.headers.host, "/org/:urlname/d/").concat(department._id, "/leave/").concat(leave.token, "/approve\">Approve Leave</a><br>\n            <a href=\"http://").concat(req.headers.host, "/org/:urlname/d/").concat(department._id, "/leave/").concat(leave.token, "/decline\">DeclineLeave</a>\n            ")
                      };
                      transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                          return res.status(500).json({
                            success: false,
                            error: error
                          });
                        } else {
                          console.log('mail sent to ' + department.manager.email);
                          return res.status(200).json({
                            message: 'Your leave request has been received'
                          });
                        }
                      });
                    }
                  }
                });
              }
            });
          }
        });
      }
    }
  }
};

exports.createLeaveRequest = createLeaveRequest;

var approveLeave = function approveLeave(req, res) {
  _Department.Department.findById(req.params.deptId, function (err, dept) {
    if (err) return response.error(res, 500, err.message);else if (!req.user) return response.error(res, 403, 'You need to be logged in');else if (!dept) return response.error(res, 404, 'Department not found');else if (String(dept.manager) !== String(req.user._id)) return response.error(res, 403, 'You need to be an admin to do that');else {
      _Leave.Leave.findOne({
        token: req.params.token
      }, function (err, leave) {
        if (err) return response.error(res, 500, err.message);else if (!leave) return response.error(res, 404, 'Leave not found');else if (String(leave.applicant) == String(req.user._id)) return response.error(res, 403, 'You cannot respond yto your own leave request');else if (leave.approvalStatus !== 'Pending') return response.error(res, 400, 'Leave request has already been responded to');else {
          leave.approvalStatus = 'Approved';
          leave.save();

          _User.User.findById(leave.applicant, function (err, applicant) {
            if (err) return response.error(res, 500, err.message);else if (!applicant) return response.error(res, 404, 'Leave applicant not found');else {
              var transporter = nodemailer.createTransport({
                service: _constants.MAIL_SERVICE,
                auth: {
                  user: _constants.MAIL_USER,
                  pass: _constants.MAIL_PASS
                }
              });
              var mailOptions = {
                from: _constants.MAIL_SENDER,
                to: applicant.email,
                subject: "Leave Request Approved",
                html: "<h2>Hi ".concat(applicant.username, " </h2>\n,\n                    <p>Your leave request has been approved by ").concat(req.user.firstName, " ").concat(req.user.lastName, "</p>\n                    <p>We hope you have a good time</p>\n                    ")
              };
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log('mail not sent to due to poor connection');
                  return res.status(500).json({
                    success: true,
                    problem: 'Mail not sent',
                    error: error
                  });
                } else {
                  console.log('mail sent to ' + applicant.email);
                  return res.status(200).json({
                    message: 'Your leave request has been accepted'
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};

exports.approveLeave = approveLeave;

var declineLeave = function declineLeave(req, res) {
  _Department.Department.findById(req.params.deptId, function (err, dept) {
    if (err) return response.error(res, 500, err.message);else if (!req.user) return response.error(res, 403, 'You need to be logged in');else if (!dept) return response.error(res, 404, 'Department not found');else if (String(dept.manager) !== String(req.user._id)) return response.error(res, 403, 'You need to be an admin to do that');else {
      _Leave.Leave.findOne({
        token: req.params.token
      }, function (err, leave) {
        if (err) return response.error(res, 500, err.message);else if (!leave) return response.error(res, 404, 'Leave not found');else if (String(leave.applicant) == String(req.user._id)) return response.error(res, 403, 'You cannot respond yto your own leave request');else if (leave.approvalStatus !== 'Pending') return response.error(res, 400, 'Leave request has already been responded to');else {
          leave.approvalStatus = 'Declined';
          leave.save();

          _User.User.findById(leave.applicant, function (err, applicant) {
            if (err) return response.error(res, 500, err.message);else if (!applicant) return response.error(res, 404, 'Leave applicant not found');else {
              var transporter = nodemailer.createTransport({
                service: _constants.MAIL_SERVICE,
                auth: {
                  user: _constants.MAIL_USER,
                  pass: _constants.MAIL_PASS
                }
              });
              var mailOptions = {
                from: _constants.MAIL_SENDER,
                to: applicant.email,
                subject: "Leave Request Approved",
                html: "<h2>Hi ".concat(applicant.username, " </h2>\n,\n                    <p>Your leave request has been declined by ").concat(req.user.firstName, " ").concat(req.user.lastName, " for some reasons</p>\n                    ")
              };
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log('mail not sent to due to poor connection');
                  return res.status(500).json({
                    status: 'declined',
                    problem: 'Mail not sent',
                    error: error
                  });
                } else {
                  console.log('mail sent to ' + applicant.email);
                  return res.status(200).json({
                    message: 'Your leave request has been declined'
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};

exports.declineLeave = declineLeave;
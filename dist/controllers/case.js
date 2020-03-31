"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inviteRespondentToCase = exports.changeCaseStatus = exports.fethThiscase = exports.respondToCase = exports.createCase = void 0;

var _TenantModels = require("../models/TenantModels");

var _Organization = require("../models/Organization");

var _Department = require("../models/Department");

var _User = require("../models/User");

var _Comment = require("../models/Comment");

var _constants = require("../config/constants");

var _mail = require("../middlewares/mail");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var response = require('../middlewares/response');

var nodemailer = require('nodemailer');

// Create new case
// POST /org/:urlname/case/new
// Parms: urlname
// req.body: title, category, description, respondents[i]
var createCase = function createCase(req, res) {
  var _req$dbModels = req.dbModels,
      TenantOrganization = _req$dbModels.TenantOrganization,
      Case = _req$dbModels.Case,
      User = _req$dbModels.User;
  TenantOrganization.findOne({
    urlname: req.params.urlname
  }).populate('employees', "username email -_id").then(function (org) {
    var list = [];
    var emailList = [];
    org.employees.forEach(function (employee) {
      return list.push(employee.username);
    });

    if (!list.includes.apply(list, _toConsumableArray(req.body.respondents))) {
      return response.error(res, 422, 'You have included a respondent who is not an employee of this organization');
    } else {
      req.body.respondents.forEach(function (respondent) {
        var i = list.indexOf(respondent);
        emailList.push(org.employees[i].email);
      });
      console.log(emailList);
      User.findById(req.user._id, function (err, user) {
        if (err) return response.error(res, 500, err.message);else if (!user) return response.error(res, 422, 'User not found');else {
          Case.create(_objectSpread({}, req.body, {
            createdBy: user.username
          }), function (err, newCase) {
            if (err) return response.error(res, 500, err.message);else {
              newCase.save();
              user.cases.push(newCase);
              org.cases.push(newCase);
              user.save();
              org.save();
              var mailOptions = {
                from: _constants.MAIL_SENDER,
                to: emailList,
                subject: "New case: (".concat(newCase.title, ") needs your response"),
                html: " \n                                <p style=\"font-family:candara;font-size:1.2em\">A new case was raised by ".concat(req.user.firstName, " ").concat(req.user.lastName, ".</p>\n                                <ul>\n                                <li style=\"font-family:candara;font-size:1.2em\">Subject: ").concat(newCase.title, "</li>\n                                <li style=\"font-family:candara;font-size:1.2em\">Category: ").concat(newCase.category, "</li>\n                                <li style=\"font-family:candara;font-size:1.2em\">Priority: ").concat(newCase.priority, "</li>\n                                <li style=\"font-family:candara;font-size:1.2em\">Details: ").concat(newCase.description, "</li>\n                                </ul>\n                                <a href=\"http://").concat(req.headers.host, "/org/").concat(org.urlname, "/case/").concat(newCase._id, "/view\" style=\"font-family:candara;font-size:1.2em\">Click to view case</a>\n                                    ")
              };
              (0, _mail.sendMailToTheseUsers)(req, res, mailOptions);
              return response.success(res, 200, 'Case created successfully');
            }
          });
        }
      });
    }
  })["catch"](function (err) {
    return response.error(res, 500, err.message);
  });
}; // Respond to existing case
// @POST /org/:urlname/case/:case_id/comment/new
// params: urlname,case_id
// req.body: notes


exports.createCase = createCase;

var respondToCase = function respondToCase(req, res) {
  var _req$dbModels2 = req.dbModels,
      TenantOrganization = _req$dbModels2.TenantOrganization,
      Case = _req$dbModels2.Case,
      Comment = _req$dbModels2.Comment;
  TenantOrganization.findOne({
    urlname: req.params.urlname
  }).populate("employees").exec(function (err, org) {
    if (!org.cases.includes(req.params.case_id)) return response.error(res, 404, 'Case not found');else {
      Case.findById(req.params.case_id).populate('comments').exec(function (err, thisCase) {
        if (err) response.error(res, 500, err.message);else if (!thisCase) return response.error(res, 404, 'Case not found');else if (thisCase.createdBy !== req.user.username && !thisCase.respondents.includes(req.user.username)) {
          return response.error(res, 403, 'You are not authorized as you are neither the creator of this case nor are you one of the respondents');
        } else {
          Comment.create(_objectSpread({}, req.body, {
            sender: req.user,
            sentFor: thisCase,
            timeSent: new Date().toUTCString(),
            notes: req.body.notes,
            recipients: thisCase.respondents
          })).then(function (comment) {
            var list = [];
            var emailList = [];
            org.employees.forEach(function (employee) {
              return list.push(employee.username);
            });
            thisCase.respondents.forEach(function (respondent) {
              var i = list.indexOf(respondent);
              emailList.push(org.employees[i].email);
            });
            comment.save();
            thisCase.comments.push(comment);
            thisCase.save();
            var mailOptions = {
              from: _constants.MAIL_SENDER,
              to: emailList,
              subject: "A new response to case: (".concat(thisCase.title, ")"),
              html: " \n                                        <p style=\"font-family:candara;font-size:1.2em\">A new response by ".concat(comment.sender.firstName, " ").concat(comment.sender.lastName, " to case: ").concat(thisCase.title, ".</p>\n                                        <ul>\n                                        <li style=\"font-family:candara;font-size:1.2em\">Case: ").concat(thisCase.title, "</li>\n                                        <li style=\"font-family:candara;font-size:1.2em\">Comment: ").concat(comment.notes, "</li>\n                                        <li style=\"font-family:candara;font-size:1.2em\">Sent on: ").concat(comment.timeSent, "</li>\n                                        </ul>\n                                        <a href=\"http://").concat(req.headers.host, "/org/").concat(org.urlname, "/case/").concat(thisCase._id, "/view\" style=\"font-family:candara;font-size:1.2em\">Click to view case</a>\n\n                                            ")
            };
            (0, _mail.sendMailToTheseUsers)(req, res, mailOptions);
            response.success(res, 200, "Response received");
          })["catch"](function (err) {
            return response.error(res, 500, err.message);
          });
        }
      });
    }
  });
}; // Fetch case to view comments
// @GET /org/:urlname/case/:case_id/view


exports.respondToCase = respondToCase;

var fethThiscase = function fethThiscase(req, res) {
  var _req$dbModels3 = req.dbModels,
      TenantOrganization = _req$dbModels3.TenantOrganization,
      Case = _req$dbModels3.Case;
  TenantOrganization.findOne({
    urlname: req.params.urlname
  }).populate("employees").exec(function (err, org) {
    if (!org.cases.includes(req.params.case_id)) return response.error(res, 404, 'Case not found');else {
      Case.findById(req.params.case_id).populate('comments', "notes sender timeSent").exec(function (err, thisCase) {
        if (err) response.error(res, 500, err.message);else if (!thisCase) return response.error(res, 404, 'Case not found');else if (thisCase.createdBy !== req.user._id && !thisCase.respondents.includes(req.user.username)) {
          return response.error(res, 403, 'You are not authorized as you are neither the creator of this case nor are you one of the respondents');
        } else {
          response.success(res, 200, thisCase);
        }
      });
    }
  });
}; // Mark case as answered, unanswered,etc
// @POST /org/:urlname/case/:case_id/status/change
// req.body: status


exports.fethThiscase = fethThiscase;

var changeCaseStatus = function changeCaseStatus(req, res) {
  var _req$dbModels4 = req.dbModels,
      TenantOrganization = _req$dbModels4.TenantOrganization,
      Case = _req$dbModels4.Case;
  TenantOrganization.findOne({
    urlname: req.params.urlname
  }).populate("employees").exec(function (err, org) {
    if (!org.cases.includes(req.params.case_id)) return response.error(res, 404, 'Case not found');else {
      Case.findById(req.params.case_id, function (err, thisCase) {
        if (err) {
          return response.error(res, 500, err.message);
        } else if (!thisCase) return response.error(res, 404, 'Case not found');else if (thisCase.createdBy !== req.user.username) {
          return response.error(res, 403, 'You are not authorized as you are not the creator of this case');
        } else {
          thisCase.status = req.body.status;
          thisCase.save(function (err, done) {
            if (err) {
              return response.error(res, 500, err.message);
            } else return res.status(200).redirect("/org/".concat(org.urlname, "/case/").concat(thisCase._id, "/view"));
          });
        }
      });
    }
  });
}; // Invite another employe to join case comment thread
// @POST /org/:urlname/case/:case_id/respondent/new
// Body: newRespondents[i]


exports.changeCaseStatus = changeCaseStatus;

var inviteRespondentToCase = function inviteRespondentToCase(req, res) {
  var _req$dbModels5 = req.dbModels,
      TenantOrganization = _req$dbModels5.TenantOrganization,
      Case = _req$dbModels5.Case;
  TenantOrganization.findOne({
    urlname: req.params.urlname
  }).populate("employees").exec(function (err, org) {
    if (!org.cases.includes(req.params.case_id)) return response.error(res, 404, 'Case not found');else {
      var list = [];
      var emailList = [];
      org.employees.forEach(function (employee) {
        return list.push(employee.username);
      });
      console.log(list);

      if (!list.includes.apply(list, _toConsumableArray(req.body.newRespondents))) {
        return response.error(res, 422, 'You have included a respondent who is not an employee of this organization');
      } else {
        req.body.newRespondents.forEach(function (respondent) {
          var i = list.indexOf(respondent);
          emailList.push(org.employees[i].email);
        });
        Case.findById(req.params.case_id, function (err, thisCase) {
          var _thisCase$respondents;

          if (err) {
            return response.error(res, 500, err.message);
          } else if (!thisCase) return response.error(res, 404, 'Case not found');else if (thisCase.createdBy !== req.user.username) {
            return response.error(res, 403, 'You are not authorized as you are not the creator of this case');
          } else if ((_thisCase$respondents = thisCase.respondents).includes.apply(_thisCase$respondents, _toConsumableArray(req.body.newRespondents))) {
            return response.error(res, 409, 'Error... you added someone who is already a respondent on this case');
          } else {
            var _thisCase$respondents2;

            (_thisCase$respondents2 = thisCase.respondents).push.apply(_thisCase$respondents2, _toConsumableArray(req.body.newRespondents));

            thisCase.save(function (err, done) {
              if (err) {
                return response.error(res, 500, err.message);
              } else {
                var mailOptions = {
                  from: _constants.MAIL_SENDER,
                  to: emailList,
                  subject: "You have been invited to a thread",
                  html: " \n                                <p style=\"font-family:candara;font-size:1.2em\">Your response is needed on this ongoing thread:  ".concat(thisCase.title, ".</p>\n                                <ul>\n                                <li style=\"font-family:candara;font-size:1.2em\">Case: ").concat(thisCase.title, "</li>\n                                <li style=\"font-family:candara;font-size:1.2em\">You were invited by: ").concat(req.user.firstName, " ").concat(req.user.lastName, " </li>\n                                </ul>\n                                <a href=\"http://").concat(req.headers.host, "/org/").concat(org.urlname, "/case/").concat(thisCase._id, "/view\" style=\"font-family:candara;font-size:1.2em\">Click to view case</a>\n\n                                    ")
                };
                (0, _mail.sendMailToTheseUsers)(req, res, mailOptions);
                return response.success(res, 200, 'Respondent have been notified to join this thread');
              }
            });
          }
        });
      }
    }
  });
};

exports.inviteRespondentToCase = inviteRespondentToCase;
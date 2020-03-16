"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggedUserisAdmin = exports.LoggedUserisEmployee = exports.orgExists = void 0;

var _Organization = require("../models/Organization");

var _User = require("../models/User");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var response = require("../middlewares/response");

var orgExists = function orgExists(req, res, next) {
  var urlname = req.params.urlname;

  _Organization.Organization.findOne({
    urlname: urlname
  }, function (err, org) {
    if (org) {
      return next();
    } else {
      response.error(res, 404, "Organization could not be found");
    }
  });
};

exports.orgExists = orgExists;

var LoggedUserisEmployee =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res, next) {
    var urlname;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            urlname = req.params.urlname;

            _Organization.Organization.findOne({
              urlname: urlname
            }, function (err, org) {
              if (err) response.error(res, 500, err.message);else if (!org) response.error(res, 404, "Organization ".concat(urlname, " not found"));else if (org.employees.includes(req.user._id)) {
                return next();
              } else {
                response.error(res, 403, "".concat(req.user.firstName, " is not an employee of ").concat(org.name));
              }
            });

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function LoggedUserisEmployee(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.LoggedUserisEmployee = LoggedUserisEmployee;

var LoggedUserisAdmin =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res, next) {
    var urlname;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            urlname = req.params.urlname;

            _Organization.Organization.findOne({
              urlname: urlname
            }, function (err, org) {
              if (err) response.error(res, 500, err.message);else if (!org) response.error(res, 404, 'This organization does not exist');else if (org.admin.includes(req.user._id)) {
                return next();
              } else {
                response.error(res, 403, "".concat(req.user.firstName, " is not an admin\n             of ").concat(org.name));
              }
            });

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function LoggedUserisAdmin(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.LoggedUserisAdmin = LoggedUserisAdmin;
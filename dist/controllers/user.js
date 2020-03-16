"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateBioData = exports.addPhoneNumber = void 0;

var _User = require("../models/User");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var response = require('../middlewares/response');

var addPhoneNumber =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var phone, user;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            phone = req.body.phone;
            _context.prev = 1;
            _context.next = 4;
            return _User.User.findById(req.user._id);

          case 4:
            user = _context.sent;

            if (!user) {
              _context.next = 11;
              break;
            }

            if (Boolean(user.phoneNumber)) {
              _context.next = 10;
              break;
            }

            user.phoneNumber = phone;
            user.save();
            return _context.abrupt("return", response.success(res, 200, "User's Phone Number Added"));

          case 10:
            return _context.abrupt("return", response.error(res, 404, "User Phone Number already exists"));

          case 11:
            _context.next = 16;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](1);
            response.error(res, 500, _context.t0.message);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 13]]);
  }));

  return function addPhoneNumber(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.addPhoneNumber = addPhoneNumber;

var updateBioData =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var _req$body, dob, maritalStatus, bioMessage, user;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$body = req.body, dob = _req$body.dob, maritalStatus = _req$body.maritalStatus, bioMessage = _req$body.bioMessage;
            _context2.prev = 1;
            _context2.next = 4;
            return _User.User.findByIdAndUpdate(req.user._id, {
              maritalStatus: maritalStatus,
              dob: dob,
              bioMessage: bioMessage
            });

          case 4:
            user = _context2.sent;

            if (user) {
              response.success(res, 200, "Added Bio Details");
            }

            _context2.next = 11;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](1);
            response.error(res, 500, _context2.t0.message);

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 8]]);
  }));

  return function updateBioData(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.updateBioData = updateBioData;
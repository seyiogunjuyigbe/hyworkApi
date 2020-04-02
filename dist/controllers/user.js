"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var response = require('../middlewares/response');

var addPhoneNumber = /*#__PURE__*/exports.addPhoneNumber = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var phone, User, username, user;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            phone = req.body.phone;
            User = req.dbModels.User;
            username = req.params.username;
            _context.prev = 3;
            _context.next = 6;
            return User.findOne({
              username: username
            });

          case 6:
            user = _context.sent;

            if (!user) {
              _context.next = 13;
              break;
            }

            if (Boolean(user.phoneNumber)) {
              _context.next = 12;
              break;
            }

            user.phoneNumber = phone;
            user.save();
            return _context.abrupt("return", response.success(res, 200, "User's Phone Number Added"));

          case 12:
            return _context.abrupt("return", response.error(res, 404, "User Phone Number already exists"));

          case 13:
            _context.next = 18;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](3);
            response.error(res, 500, _context.t0.message);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 15]]);
  }));

  return function addPhoneNumber(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var updateBioData = /*#__PURE__*/exports.updateBioData = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var _req$body, dob, maritalStatus, bioMessage, User, user;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$body = req.body, dob = _req$body.dob, maritalStatus = _req$body.maritalStatus, bioMessage = _req$body.bioMessage;
            User = req.dbModels.User;
            _context2.prev = 2;
            _context2.next = 5;
            return User.findOneAndUpdate({
              username: req.params.username
            }, {
              maritalStatus: maritalStatus,
              dob: dob,
              bioMessage: bioMessage
            });

          case 5:
            user = _context2.sent;

            if (user) {
              response.success(res, 200, "Upodated Bio Details");
            }

            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](2);
            response.error(res, 500, _context2.t0.message);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 9]]);
  }));

  return function updateBioData(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var addPassword = exports.addPassword = function addPassword(req, res) {
  var User = req.dbModels.User;
  var _req$body2 = req.body,
      password = _req$body2.password,
      confirmPassword = _req$body2.confirmPassword;
  var username = req.params.username;

  if (password !== confirmPassword) {
    response.error(res, 404, 'Password and Confirm Password must be the same');
  }

  if (password.length < 8) {
    response.error(res, 404, 'Password needs to be eight characters long');
  }

  User.findOne({
    username: username
  }, function (err, user) {
    if (err) {
      response.error(res, 404, err);
    }

    user.changePassword(user.password, password, function (err, user) {
      if (err) {
        response.error(res, 404, err);
      }

      user.save();
    });
  });
};

var addDependentToUser = exports.addDependentToUser = function addDependentToUser(req, res) {
  var _req$dbModels = req.dbModels,
      User = _req$dbModels.User,
      Dependent = _req$dbModels.Dependent;
  var _req$body3 = req.body,
      firstName = _req$body3.firstName,
      lastName = _req$body3.lastName,
      relationship = _req$body3.relationship,
      phoneNumber = _req$body3.phoneNumber,
      email = _req$body3.email;
  var username = req.params.username;
  User.findOne({
    username: username
  }, function (err, user) {
    if (err) {
      response.error(res, 501, err);
    }

    Dependent.create({
      firstName: firstName,
      lastName: lastName,
      relationship: relationship,
      phoneNumber: phoneNumber,
      email: email
    }, function (err, dependent) {
      if (err) {
        response.error(res, 501, err);
      }

      user.dependents.push(dependent._id);
      user.save();
      response.success(res, 201, "Dependent added");
    });
  });
};

var removeDependentFromUser = exports.removeDependentFromUser = function removeDependentFromUser(req, res) {
  var _req$dbModels2 = req.dbModels,
      User = _req$dbModels2.User,
      Dependent = _req$dbModels2.Dependent;
  var _req$params = req.params,
      username = _req$params.username,
      id = _req$params.id;
  Dependent.findById({
    id: id
  }, function (err, dependent) {
    if (err) {
      response.error(res, 500, err);
    }

    User.findOne({
      username: username
    }, function (err, user) {
      if (err) {
        response.error(res, 500, err);
      }

      if (user.dependents.includes(dependent._id)) {
        user.dependents = user.dependents.filter(function (entry) {
          entry === dependent._id;
        });
        user.save();
        response.success(res, 201, "Dependent ".concat(dependent.firstName, " removed"));
      }
    });
  });
};

var updateBioMessage = function updateBioMessage(req, res) {
  var User = req.dbModels.User;
  var username = req.params.username;
  var bioMessage = req.body.bioMessage;
  User.findOne({
    username: username
  }, function (err, user) {
    if (err) {
      response.error(res, 404, err);
    }

    user.bioMessage = bioMessage;
    user.save();
    response.success(res, 201, "Successfully added user bioMessage");
  });
};

var addAddress = function addAddress(req, res) {
  var User = req.dbModels.User;
  var username = req.params.username;
  var address = req.body.address;
  User.findOne({
    username: username
  }, function (err, user) {
    if (err) {
      response.error(res, 404, err);
    }

    user.address = address;
    user.save();
    response.success(res, 201, "Successfully added user's address");
  });
};
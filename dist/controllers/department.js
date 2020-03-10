"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.addDeptToOrg = exports.removeEmployee = exports.addEmployee = exports.addManager = exports.createDepartment = void 0;

var _Organization = require("../models/Organization");

var _Department = require("../models/Department");

var _User = require("../models/User");

var _crud = require("../../utils/crud");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var response = require("../middlewares/response"); //Route: org/:urlname/department/create


var createDepartment =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var _req$body, title, description, org;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body = req.body, title = _req$body.title, description = _req$body.description;
            _context.prev = 1;
            _context.next = 4;
            return _Organization.Organization.findOne({
              urlname: req.params.urlname
            });

          case 4:
            org = _context.sent;

            _Department.Department.create({
              title: title,
              description: description,
              dateCreated: Date.now()
            }, function (err, dept) {
              if (err) {
                response.error(res, 404, err);
              }

              org.department.push(dept._id);
              org.save();
              response.success(res, 200, "Added department ".concat(dept.title, " to organization ").concat(org.name));
            });

            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](1);
            response.error(res, 500, _context.t0.message);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 8]]);
  }));

  return function createDepartment(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); //Route: org/:urlname/department/:title/addManager/:username


exports.createDepartment = createDepartment;

var addManager =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var _req$params, id, username, org;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$params = req.params, id = _req$params.id, username = _req$params.username;
            _context2.prev = 1;
            _context2.next = 4;
            return _Organization.Organization.findOne({
              urlname: req.params.urlname
            });

          case 4:
            org = _context2.sent;

            _Department.Department.findById(id, function (err, dept) {
              if (err) {
                response.error(res, 404, err);
              }

              _User.User.findOne({
                username: username
              }, function (err, user) {
                if (err) {
                  response.error(res, 404, err);
                }

                if (org.department.includes(dept._id)) {
                  dept.manager = user._id;
                  dept.save();
                  response.success(res, 200, "Made User ".concat(user.username, " the manager of department ").concat(dept.title));
                } else {
                  response.error(res, 404, "Department ".concat(dept.title, " not a department in organization ").concat(org.name));
                }
              });
            });

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

  return function addManager(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}(); //Route: org/:urlname/department/:title/addEmployee/:username


exports.addManager = addManager;

var addEmployee =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res) {
    var _req$params2, id, username, org;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _req$params2 = req.params, id = _req$params2.id, username = _req$params2.username;
            _context3.prev = 1;
            _context3.next = 4;
            return _Organization.Organization.findOne({
              urlname: req.params.urlname
            });

          case 4:
            org = _context3.sent;

            _Department.Department.findById(id, function (err, dept) {
              if (err) {
                response.error(res, 404, err);
              }

              _User.User.findOne({
                username: username
              }, function (err, user) {
                if (err) {
                  return response.error(res, 404, err);
                }

                if (dept.employees.includes(user._id)) {
                  return response.error(res, 500, "".concat(user.firstName, " ").concat(user.lastName, " is already a member of department ").concat(dept.title));
                }

                dept.employees.push(user._id);
                dept.save();
                return response.success(res, 200, "Added ".concat(user.firstName, " to department ").concat(dept.title));
              });
            });

            _context3.next = 11;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](1);
            return _context3.abrupt("return", response.error(res, 500, _context3.t0.message));

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 8]]);
  }));

  return function addEmployee(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}(); //Remove employee from department


exports.addEmployee = addEmployee;

var removeEmployee =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(req, res) {
    var _req$params3, id, username, org;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _req$params3 = req.params, id = _req$params3.id, username = _req$params3.username;
            _context4.prev = 1;
            _context4.next = 4;
            return _Organization.Organization.findOne({
              urlname: req.params.urlname
            });

          case 4:
            org = _context4.sent;

            _Department.Department.findById(id, function (err, dept) {
              if (err) {
                response.error(res, 404, err);
              }

              if (org.department.includes(dept._id)) {
                _User.User.findOne({
                  username: username
                }, function (err, user) {
                  if (err) {
                    return response.error(res, 404, err);
                  }

                  if (dept.employees.includes(user._id)) {
                    dept.employees = dept.employees.filter(function (value) {
                      value === user._id;
                    });
                    dept.save();
                    return response.success(res, 200, "Removed ".concat(user.firstName, " from department ").concat(dept.title));
                  } else {
                    return response.error(res, 404, "".concat(user.firstName, " is not a member of this department"));
                  }
                });
              } else {
                response.error(res, 404, "Department ".concat(dept.title, " not a department in organization ").concat(org.name));
              }
            });

            _context4.next = 11;
            break;

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4["catch"](1);
            return _context4.abrupt("return", response.error(res, 500, _context4.t0.message));

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 8]]);
  }));

  return function removeEmployee(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}(); // Route: /organization/:urlname/department/:title/add


exports.removeEmployee = removeEmployee;

var addDeptToOrg =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(req, res) {
    var _req$params4, id, urlname, org;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _req$params4 = req.params, id = _req$params4.id, urlname = _req$params4.urlname;
            _context5.prev = 1;
            _context5.next = 4;
            return _Organization.Organization.findOne({
              urlname: urlname
            });

          case 4:
            org = _context5.sent;

            _Department.Department.findById(id, function (err, dept) {
              if (err) {
                return response.error(res, 404, err);
              }

              if (org.department.includes(dept._id)) {
                return response.error(res, 404, "Department ".concat(dept.title, " already exists in organization ").concat(org.name));
              }

              org.department.push(dept._id);
              org.save();
              return response.success(res, 200, "Added department ".concat(dept.title, " to organization ").concat(org.name));
            });

            _context5.next = 11;
            break;

          case 8:
            _context5.prev = 8;
            _context5.t0 = _context5["catch"](1);
            return _context5.abrupt("return", response.error(res, 500, _context5.t0.message));

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[1, 8]]);
  }));

  return function addDeptToOrg(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

exports.addDeptToOrg = addDeptToOrg;

var _default = (0, _crud.crudControllers)(_Department.Department);

exports["default"] = _default;
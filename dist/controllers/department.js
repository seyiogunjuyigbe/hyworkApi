"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeOne = exports.addDeptToOrg = exports.removeEmployee = exports.addEmployee = exports.addManager = exports.createDepartment = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var response = require("../middlewares/response"); //Route: org/:urlname/department/create


var createDepartment = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var _req$body, title, description, _req$dbModels, Department, TenantOrganization, org;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body = req.body, title = _req$body.title, description = _req$body.description;
            _req$dbModels = req.dbModels, Department = _req$dbModels.Department, TenantOrganization = _req$dbModels.TenantOrganization;
            _context.prev = 2;
            _context.next = 5;
            return TenantOrganization.findOne({
              urlname: req.params.urlname
            });

          case 5:
            org = _context.sent;
            Department.create({
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
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](2);
            response.error(res, 500, _context.t0.message);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 9]]);
  }));

  return function createDepartment(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); //Route: org/:urlname/department/:title/addManager/:username


exports.createDepartment = createDepartment;

var addManager = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var _req$dbModels2, Department, TenantOrganization, User, _req$params, id, username, org;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$dbModels2 = req.dbModels, Department = _req$dbModels2.Department, TenantOrganization = _req$dbModels2.TenantOrganization, User = _req$dbModels2.User;
            _req$params = req.params, id = _req$params.id, username = _req$params.username;
            _context2.prev = 2;
            _context2.next = 5;
            return TenantOrganization.findOne({
              urlname: req.params.urlname
            });

          case 5:
            org = _context2.sent;
            Department.findById(id, function (err, dept) {
              if (err) {
                response.error(res, 404, err);
              }

              User.findOne({
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

  return function addManager(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}(); //Route: org/:urlname/department/:title/addEmployee/:username


exports.addManager = addManager;

var addEmployee = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var _req$dbModels3, Department, TenantOrganization, User, _req$params2, id, username, org;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _req$dbModels3 = req.dbModels, Department = _req$dbModels3.Department, TenantOrganization = _req$dbModels3.TenantOrganization, User = _req$dbModels3.User;
            _req$params2 = req.params, id = _req$params2.id, username = _req$params2.username;
            _context3.prev = 2;
            _context3.next = 5;
            return TenantOrganization.findOne({
              urlname: req.params.urlname
            });

          case 5:
            org = _context3.sent;
            Department.findById(id, function (err, dept) {
              if (err) {
                response.error(res, 404, err);
              }

              User.findOne({
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
            _context3.next = 12;
            break;

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](2);
            return _context3.abrupt("return", response.error(res, 500, _context3.t0.message));

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 9]]);
  }));

  return function addEmployee(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}(); //Remove employee from department


exports.addEmployee = addEmployee;

var removeEmployee = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var _req$dbModels4, Department, TenantOrganization, User, _req$params3, id, username, org;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _req$dbModels4 = req.dbModels, Department = _req$dbModels4.Department, TenantOrganization = _req$dbModels4.TenantOrganization, User = _req$dbModels4.User;
            _req$params3 = req.params, id = _req$params3.id, username = _req$params3.username;
            _context4.prev = 2;
            _context4.next = 5;
            return TenantOrganization.findOne({
              urlname: req.params.urlname
            });

          case 5:
            org = _context4.sent;
            Department.findById(id, function (err, dept) {
              if (err) {
                response.error(res, 404, err);
              }

              if (org.department.includes(dept._id)) {
                User.findOne({
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
            _context4.next = 12;
            break;

          case 9:
            _context4.prev = 9;
            _context4.t0 = _context4["catch"](2);
            return _context4.abrupt("return", response.error(res, 500, _context4.t0.message));

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[2, 9]]);
  }));

  return function removeEmployee(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}(); // Route: /organization/:urlname/department/:title/add


exports.removeEmployee = removeEmployee;

var addDeptToOrg = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    var _req$dbModels5, Department, TenantOrganization, User, _req$params4, id, urlname, org;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _req$dbModels5 = req.dbModels, Department = _req$dbModels5.Department, TenantOrganization = _req$dbModels5.TenantOrganization, User = _req$dbModels5.User;
            _req$params4 = req.params, id = _req$params4.id, urlname = _req$params4.urlname;
            _context5.prev = 2;
            _context5.next = 5;
            return TenantOrganization.findOne({
              urlname: urlname
            });

          case 5:
            org = _context5.sent;
            Department.findById(id, function (err, dept) {
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
            _context5.next = 12;
            break;

          case 9:
            _context5.prev = 9;
            _context5.t0 = _context5["catch"](2);
            return _context5.abrupt("return", response.error(res, 500, _context5.t0.message));

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[2, 9]]);
  }));

  return function addDeptToOrg(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

exports.addDeptToOrg = addDeptToOrg;

var removeOne = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
    var Department, removed;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            Department = req.dbModels.Department;
            _context6.next = 4;
            return Department.findOneAndRemove({
              _id: req.params.id
            });

          case 4:
            removed = _context6.sent;

            if (removed) {
              _context6.next = 7;
              break;
            }

            return _context6.abrupt("return", res.status(400).end());

          case 7:
            return _context6.abrupt("return", res.status(200).json({
              data: removed
            }));

          case 10:
            _context6.prev = 10;
            _context6.t0 = _context6["catch"](0);
            console.error(_context6.t0);
            res.status(400).end();

          case 14:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 10]]);
  }));

  return function removeOne(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

exports.removeOne = removeOne;
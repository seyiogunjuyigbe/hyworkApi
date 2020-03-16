"use strict";

var _Organization = require("../models/Organization");

var _User = require("../models/User");

var _Token = require("../models/Token");

var _crud = require("../../utils/crud");

var _mail = require("../middlewares/mail");

var _middleware = require("../middlewares/middleware");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var response = require("../middlewares/response");

var errors = [];
module.exports = {
  // Render page to create new organization
  renderCreateOrgPage: function renderCreateOrgPage(req, res) {
    if (!req.user) return res.status(403).redirect('/auth/login?redirect=/org/new');else if (req.user.createdOrganizations.length >= 10 || req.user.role == 'user') return res.status(403).render('403', {
      message: 'You are not permitted to create more organizations'
    });else return res.status(200).render('organization/new', {
      user: req.user,
      baseUrl: "http://".concat(req.headers.host, "/org/")
    });
  },
  // Controller that creates a new organization. The user that creates the organization is immediately added as the
  //the an admin of the newly created organisation.
  createOrganization: function () {
    var _createOrganization = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(req, res) {
      var newOrg, user;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;

              if (req.user.createdOrganizations.length >= 10) {
                errors.push('User has registered more than 10 organizations');
              }

              if ((0, _middleware.checkUrlExists)(req.body.urlname)) {
                errors.push("Organization with the username ".concat(req.body.urlname, " already exists"));
              }

              if (!(errors.length === 0)) {
                _context.next = 21;
                break;
              }

              _context.next = 6;
              return _Organization.Organization.create(req.body);

            case 6:
              newOrg = _context.sent;
              newOrg.urlname = req.body.urlname.toLowerCase();
              newOrg.admin.push(req.user._id);
              newOrg.employees.push(req.user._id);
              newOrg.save();
              _context.next = 13;
              return _User.User.findOne({
                _id: req.user._id
              });

            case 13:
              user = _context.sent;
              user.role = 'admin';
              user.createdOrganizations.push(newOrg._id);
              user.save();
              (0, _mail.sendCreateOrganisationEmail)(user, newOrg, req, res);
              return _context.abrupt("return", res.status(200).redirect("/org/".concat(newOrg.urlname)));

            case 21:
              return _context.abrupt("return", res.status(500).render('error/500', {
                message: errors
              }));

            case 22:
              _context.next = 27;
              break;

            case 24:
              _context.prev = 24;
              _context.t0 = _context["catch"](0);
              return _context.abrupt("return", res.status(500).render('error/500', {
                message: _context.t0
              }));

            case 27:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 24]]);
    }));

    function createOrganization(_x, _x2) {
      return _createOrganization.apply(this, arguments);
    }

    return createOrganization;
  }(),
  addUserToOrganization: function () {
    var _addUserToOrganization = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(req, res) {
      var email, user, updatedOrganization;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              email = req.body.email;
              _context2.prev = 1;
              _context2.next = 4;
              return _User.User.findOneAndUpdate({
                email: email
              }, req.body, {
                upsert: true,
                "new": true,
                runValidators: true
              });

            case 4:
              user = _context2.sent;
              _context2.next = 7;
              return _Organization.Organization.findOne({
                urlname: req.params.urlname
              });

            case 7:
              updatedOrganization = _context2.sent;
              updatedOrganization.employees.push(user._id);
              updatedOrganization.save(function (err) {
                if (err) {
                  return response.error(res, 500, "User could not be added to organization");
                }

                (0, _mail.senduserEmail)(user, updatedOrganization, req, res);
              });
              _context2.next = 15;
              break;

            case 12:
              _context2.prev = 12;
              _context2.t0 = _context2["catch"](1);
              response.error(res, 500, _context2.t0.message);

            case 15:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[1, 12]]);
    }));

    function addUserToOrganization(_x3, _x4) {
      return _addUserToOrganization.apply(this, arguments);
    }

    return addUserToOrganization;
  }(),
  fetchOrganization: function () {
    var _fetchOrganization = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(req, res) {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _Organization.Organization.find({
                urlname: req.params.urlname
              }, function (err, org) {
                if (org) {
                  return res.status(200).render('organization/adminDashboard', _defineProperty({
                    admin: req.user,
                    org: org
                  }, "org", org));
                }

                if (err) {
                  response.error(res, 500, err);
                }
              });

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    function fetchOrganization(_x5, _x6) {
      return _fetchOrganization.apply(this, arguments);
    }

    return fetchOrganization;
  }(),
  deleteOrganization: function () {
    var _deleteOrganization = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(req, res) {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _Organization.Organization.deleteOne({
                urlname: req.params.urlname
              }, function (err) {
                if (err) {
                  response.error(res, 404, err);
                }

                response.success(res, 200, 'Organization successfully deleted');
              });

            case 1:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    function deleteOrganization(_x7, _x8) {
      return _deleteOrganization.apply(this, arguments);
    }

    return deleteOrganization;
  }(),
  updateOrganization: function () {
    var _updateOrganization = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5(req, res) {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _Organization.Organization.findOneAndUpdate({
                urlname: req.params.urlname
              }, req.body, function (err, org) {
                if (err) {
                  response.error(res, 404, err);
                }

                response.success(res, 200, 'Organization successfully deleted');
              });

            case 1:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    function updateOrganization(_x9, _x10) {
      return _updateOrganization.apply(this, arguments);
    }

    return updateOrganization;
  }(),
  fetchEmployeeData: function () {
    var _fetchEmployeeData = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6(req, res) {
      var user;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return _User.User.findOne({
                username: req.params.username
              }).lean().exec();

            case 2:
              user = _context6.sent;

              if (user) {
                _Organization.Organization.findOne({
                  urlname: req.params.urlname,
                  employees: user._id
                }, function (err, org) {
                  if (err) {
                    response.error(res, 404, err);
                  }

                  response.success(res, 200, user);
                });
              } else {
                response.error(res, 404, "No user with that username");
              }

            case 4:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    function fetchEmployeeData(_x11, _x12) {
      return _fetchEmployeeData.apply(this, arguments);
    }

    return fetchEmployeeData;
  }(),
  verifyEmployee: function () {
    var _verifyEmployee = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7(req, res) {
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              if (req.params.token) {
                _context7.next = 2;
                break;
              }

              return _context7.abrupt("return", response.error(res, 400, "No token attached"));

            case 2:
              _Token.Token.findOne({
                token: req.params.token
              }, function (err, token) {
                if (!token) {
                  return response.error(res, 400, 'We were unable to find a valid token. Your token may have expired.');
                }

                if (token) {
                  _User.User.findOne({
                    _id: token.userId
                  }, function (err, user) {
                    if (!user) {
                      return response.error(res, 400, 'We were unable to find a user for this token.');
                    }

                    if (user.isVerified) {
                      return response.error(res, 400, 'This user has already been verified.');
                    }

                    user.isVerified = true;
                    user.save(function (err) {
                      if (err) {
                        return res.status(500).json({
                          message: err.message
                        });
                      }
                    });
                    response.success(res, 200, user);
                  });
                }
              });

            case 3:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    function verifyEmployee(_x13, _x14) {
      return _verifyEmployee.apply(this, arguments);
    }

    return verifyEmployee;
  }(),
  checkIfOrgExists: function checkIfOrgExists(req, res, next) {
    _Organization.Organization.findOne({
      urlname: req.params.urlname
    }, function (err, org) {
      if (err) return err;else if (!org) return response.error(res, 204, "Url available");else if (org) return response.error(res, 200, "Url not available");
    });
  }
};
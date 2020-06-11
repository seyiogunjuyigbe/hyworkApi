"use strict";

var _Organization = require("../models/Organization");

var _User3 = require("../models/User");

var _Token = require("../models/Token");

var _mail = require("../middlewares/mail");

var _middleware = require("../middlewares/middleware");

var _passport = require("../config/passport");

var _constants = require("../config/constants");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var response = require("../middlewares/response");

var _require = require('../database/multiDb.js'),
    getDBInstance = _require.getDBInstance;

var nanoid = require('nanoid');

var passport = require('passport');

var _require2 = require('express-validator'),
    validationResult = _require2.validationResult;

(0, _passport.passportConfig)(passport);
var baseUrl = "http://localhost:3000";
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
  createOrganization: function createOrganization(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var dbName, TenantOrganization, newOrg, tOrg, user;
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
                _context.next = 30;
                break;
              }

              dbName = req.body.urlname.toLowerCase();
              getDBInstance(dbName);
              TenantOrganization = getDBInstance(dbName).models.TenantOrganization;
              _context.next = 9;
              return _Organization.Organization.create(req.body);

            case 9:
              newOrg = _context.sent;
              newOrg.urlname = req.body.urlname.toLowerCase();
              newOrg.admin.push(req.user._id);
              newOrg.employees.push(req.user._id);
              newOrg.save();
              _context.next = 16;
              return TenantOrganization.create(req.body);

            case 16:
              tOrg = _context.sent;
              tOrg.admin.push(req.user._id);
              tOrg.employees.push(req.user._id);
              tOrg.save();
              _context.next = 22;
              return _User3.User.findById(req.user._id);

            case 22:
              user = _context.sent;
              user.role = 'admin';
              user.createdOrganizations.push(newOrg._id);
              user.save();
              (0, _mail.sendCreateOrganisationEmail)(user, newOrg, req, res);
              return _context.abrupt("return", response.success(res, 200, "Organization ".concat(tOrg.name, " created")));

            case 30:
              return _context.abrupt("return", res.status(500).render('error/500', {
                message: errors
              }));

            case 31:
              _context.next = 36;
              break;

            case 33:
              _context.prev = 33;
              _context.t0 = _context["catch"](0);
              return _context.abrupt("return", res.status(500).render('error/500', {
                message: _context.t0
              }));

            case 36:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 33]]);
    }))();
  },
  addUserToOrganization: function addUserToOrganization(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var _req$body, firstName, lastName, username, _req$dbModels, User, TenantOrganization, user;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _req$body = req.body, firstName = _req$body.firstName, lastName = _req$body.lastName, username = _req$body.username;
              _req$dbModels = req.dbModels, User = _req$dbModels.User, TenantOrganization = _req$dbModels.TenantOrganization;
              _context2.prev = 2;
              _context2.next = 5;
              return new User(_objectSpread({}, req.body, {
                tempPassword: nanoid(8),
                firstName: firstName.trim(),
                lastName: lastName.trim()
              }));

            case 5:
              user = _context2.sent;
              user.username = username.trim().toLowerCase();
              User.register(user, user.tempPassword, function (err, user) {
                if (err) {
                  return response.error(res, 500, err.message);
                } else {
                  user.save(function (err) {
                    if (err) return res.status(500).json({
                      err: err
                    });
                    TenantOrganization.findOne({
                      urlname: req.params.urlname
                    }, function (err, updatedOrganization) {
                      if (err) {
                        return response.error(res, 500, err.message);
                      } else if (!updatedOrganization) return response.error(res, 404, 'Organization not found');

                      updatedOrganization.employees.push(user._id);
                      updatedOrganization.save(function (err) {
                        if (err) {
                          return response.error(res, 500, "User could not be added to organization");
                        }

                        (0, _mail.senduserEmail)(user, updatedOrganization, req, res);
                        response.success(res, 200, "Successfully added ".concat(user.firstName, " ").concat(user.lastName));
                      });
                    });
                  });
                }
              });
              _context2.next = 13;
              break;

            case 10:
              _context2.prev = 10;
              _context2.t0 = _context2["catch"](2);
              response.error(res, 500, _context2.t0.message);

            case 13:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[2, 10]]);
    }))();
  },
  fetchOrganization: function fetchOrganization(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var TenantOrganization;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              TenantOrganization = req.dbModels.TenantOrganization;
              TenantOrganization.findOne({
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

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }))();
  },
  deleteOrganization: function deleteOrganization(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
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
    }))();
  },
  updateOrganization: function updateOrganization(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
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
    }))();
  },
  fetchEmployeeData: function fetchEmployeeData(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
      var user;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return _User3.User.findOne({
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
    }))();
  },
  verifyEmployee: function verifyEmployee(req, res) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
      var _req$dbModels2, User, Token;

      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _req$dbModels2 = req.dbModels, User = _req$dbModels2.User, Token = _req$dbModels2.Token;

              if (req.params.token) {
                _context7.next = 3;
                break;
              }

              return _context7.abrupt("return", response.error(res, 400, "No token attached"));

            case 3:
              Token.findOne({
                token: req.params.token
              }, function (err, token) {
                if (err) return response.error(res, 500, err.message);else if (!token) {
                  return response.error(res, 400, 'We were unable to find a valid token. Your token may have expired.');
                }

                if (token) {
                  User.findOne({
                    _id: token.userId
                  }, function (err, user) {
                    if (!user) {
                      return response.error(res, 400, 'We were unable to find a user for this token.');
                    } else if (user.isVerified) {
                      return response.error(res, 400, 'This user has already been verified.');
                    } else {
                      user.isVerified = true;
                      user.save();
                      return res.redirect(200, "/org/".concat(req.params.urlname, "/user/").concat(token.token, "/onboard"));
                    }
                  });
                }
              });

            case 4:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }))();
  },
  renderPasswordPageForUser: function renderPasswordPageForUser(req, res) {
    var _req$dbModels3 = req.dbModels,
        User = _req$dbModels3.User,
        Token = _req$dbModels3.Token;

    if (!req.params.token) {
      return response.error(res, 400, "No token attached");
    }

    Token.findOne({
      token: req.params.token
    }, function (err, token) {
      if (err) return response.error(res, 500, err.message);else if (!token) {
        return response.error(res, 400, 'We were unable to find a valid token. Your token may have expired.');
      }

      if (token) {
        User.findOne({
          _id: token.userId
        }, function (err, user) {
          if (!user) {
            return response.error(res, 400, 'We were unable to find a user for this token.');
          } else {
            return res.render('createPassword', {
              user: user,
              token: token.token,
              urlname: req.params.urlname
            });
          }
        });
      }
    });
  },
  createPasswordForUser: function createPasswordForUser(req, res) {
    var _req$dbModels4 = req.dbModels,
        User = _req$dbModels4.User,
        Token = _req$dbModels4.Token;
    var username = req.body.username;
    var token = req.params.token;
    Token.findOne({
      token: token
    }, function (err, token) {
      if (err) return response.error(res, 500, err.message);else if (!token) return response.error(res, 404, 'Token not found');else {
        User.findOne({
          username: username
        }, function (err, user) {
          if (err) return response.error(res, 500, err.message);else if (!user) return response.error(res, 404, 'User not found');else if (req.body.password !== req.body.confirmPassword) {
            return response.error(res, 422, 'Passwords do not match');
          } else {
            user.setPassword(req.body.password, function (err, user) {
              if (err) {
                return res.status(500).render('500');
              }

              user.tempPassword = "";
              user.isVerified = true;
              user.save(function (err) {
                if (err) return res.status(500).render('500');else {
                  // send email 
                  var mailOptions = {
                    to: user.email,
                    from: _constants.MAIL_SENDER,
                    subject: "Your password has been set",
                    text: "Hi ".concat(user.username, " \n \n                  This is a confirmation that the password for your account ").concat(user.email, " has just been set.\n")
                  };
                  (0, _mail.sendMailToTheseUsers)(req, res, mailOptions);
                  response.success(res, 200, 'User has been fully onboarded');
                }
              });
            });
          }
        });
      }
    });
  },
  checkIfOrgExists: function checkIfOrgExists(req, res, next) {
    _Organization.Organization.findOne({
      urlname: req.params.urlname
    }, function (err, org) {
      if (err) return err;else if (!org) return response.error(res, 204, "Url available");else if (org) return response.error(res, 200, "Url not available");
    });
  },
  orgLoginUser: function orgLoginUser(req, res, next) {
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      var error = [];
      errors.array().map(function (err) {
        return error.push(err.msg);
      });
      return response.error(res, 422, error);
    } else {
      var _req$dbModels5 = req.dbModels,
          _User = _req$dbModels5.User,
          TenantOrganization = _req$dbModels5.TenantOrganization;
      TenantOrganization.findOne({
        urlname: req.params.urlname
      }, function (err, org) {
        if (err) return response.error(res, 500, err.message);else if (!org) return response.error(res, 404, 'Organization ' + req.params.urlname + ' not found');

        _User.findOne({
          email: req.body.email
        }, function (err, user) {
          if (err) response.error(res, 500, err.message);else if (!user) {
            return response.error(res, 403, 'No user found with this email address');
          } else if (!org.employees.includes(user._id)) return response.error(res, 403, 'You are not a member of this org');else {
            if (req.body.password) {
              passport.serializeUser(_User.serializeUser());
              passport.deserializeUser(_User.deserializeUser());
              user.authenticate(req.body.password, function (err, found, passwordErr) {
                if (err) {
                  return response.error(res, 500, err.message);
                } else if (passwordErr) {
                  return response.error(res, 500, 'Incorrect Password');
                } else if (found) {
                  req.login(user, function (err) {
                    if (err) {
                      return response.error(res, 500, err.message);
                    }

                    req.session.userId = user._id;
                    req.session.save();
                    next();
                  });
                }
              });
            }
          }
        });
      });
    }
  },
  orgLoginCb: function orgLoginCb(req, res) {
    return res.status(200).json({
      success: true,
      message: 'Logged in as ' + req.user.username
    });
  },
  orgLogoutUser: function orgLogoutUser(req, res) {
    req.session.userId = undefined;
    req.session.destroy();
    req.logout();
    response.success(res, 200, 'Successfully logged out');
  },
  fetchMyProfile: function fetchMyProfile(req, res) {
    if (!req.user) {
      return response.error(res, 401, 'You need to be logged in');
    } else {
      var username = req.user.username;
      var _req$dbModels6 = req.dbModels,
          _User2 = _req$dbModels6.User,
          TenantOrganization = _req$dbModels6.TenantOrganization;
      var urlname = req.params.urlname;
      TenantOrganization.findOne({
        urlname: urlname
      }, function (err, org) {
        if (err) return response.error(res, 500, err.message);else if (!org) return response.error(res, 404, 'Org not found');else {
          _User2.findOne({
            username: username
          }, function (err, user) {
            if (err) return response.error(res, 500, err.message);else if (!user) return response.error(res, 404, 'User not found');else if (!org.employees.includes(user._id)) return response.error(res, 403, 'You are not a memner of this org');else {
              return response.success(res, 200, user);
            }
          });
        }
      });
    }
  }
};
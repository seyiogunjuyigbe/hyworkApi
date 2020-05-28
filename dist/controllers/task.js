"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addDeadlineToTask = exports.getFilesAssignedToTask = exports.getTasksAssignedToUser = exports.addFiletoTask = exports.createTask = undefined;

var _crud = require("../utils/crud");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// import moment from 'moment';
var response = require("../middlewares/response");

var moment = require('moment'); //Create Task
// Route: org/:urlname/task/add/:username


var createTask = /*#__PURE__*/exports.createTask = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var _req$params, urlname, username, _req$body, title, description, _req$dbModels, Task, User, TenantOrganization, org;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$params = req.params, urlname = _req$params.urlname, username = _req$params.username;
            _req$body = req.body, title = _req$body.title, description = _req$body.description;
            _req$dbModels = req.dbModels, Task = _req$dbModels.Task, User = _req$dbModels.User, TenantOrganization = _req$dbModels.TenantOrganization;
            _context.prev = 3;
            _context.next = 6;
            return TenantOrganization.findOne({
              urlname: urlname
            });

          case 6:
            org = _context.sent;

            if (!org.employees.includes(req.user._id)) {
              _context.next = 11;
              break;
            }

            Task.create({
              title: title,
              description: description
            }, function (err, task) {
              if (err) {
                return response.error(res, 404, err.nessage);
              }

              User.findOne({
                username: username
              }, function (err, user) {
                if (err) {
                  return response.error(res, 404, err.message);
                }

                task.assignedBy = req.user._id;
                task.assignedTo = user._id;
                task.timeAssigned = Date.now();
                task.save().then(response.success(res, 200, task));
              });
            });
            _context.next = 12;
            break;

          case 11:
            return _context.abrupt("return", response.error(res, 404, "User is not an employee "));

          case 12:
            _context.next = 17;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](3);
            return _context.abrupt("return", response.error(res, 500, "Could not find organization"));

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 14]]);
  }));

  return function createTask(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); // Add a file to a task
//Route: org/:urlname/task/:id/add/file/:fileId


var addFiletoTask = /*#__PURE__*/exports.addFiletoTask = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var _req$dbModels2, Task, File, TenantOrganization, _req$params2, urlname, id, fileId, org;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$dbModels2 = req.dbModels, Task = _req$dbModels2.Task, File = _req$dbModels2.File, TenantOrganization = _req$dbModels2.TenantOrganization;
            _req$params2 = req.params, urlname = _req$params2.urlname, id = _req$params2.id, fileId = _req$params2.fileId;
            _context2.prev = 2;
            _context2.next = 5;
            return TenantOrganization.findOne({
              urlname: urlname
            });

          case 5:
            org = _context2.sent;

            if (org.employees.includes(req.user._id)) {
              Task.findById(id, function (err, task) {
                if (err) {
                  return response.error(res, 404, err.message);
                }

                File.findById(fileId, function (err, file) {
                  if (err) {
                    return response.error(res, 404, err.message);
                  }

                  if (task.files.includes(file._id)) {
                    return response.error(res, 404, "File has already been added");
                  }

                  task.files.push(file._id);
                  task.save().then(response.success(res, 200, "File ".concat(file.title, " has been added to task ").concat(task.title)));
                });
              });
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

  return function addFiletoTask(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}(); //Get tasks assigned to a User
//Route: org/:urlname/task/assignedto/:username


var getTasksAssignedToUser = /*#__PURE__*/exports.getTasksAssignedToUser = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var _req$dbModels3, Task, User, username, user;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _req$dbModels3 = req.dbModels, Task = _req$dbModels3.Task, User = _req$dbModels3.User;
            username = req.params.username;
            _context3.prev = 2;
            _context3.next = 5;
            return User.findOne({
              username: username
            });

          case 5:
            user = _context3.sent;

            if (user) {
              Task.find({
                assignedTo: user._id
              }, function (err, tasks) {
                if (err) {
                  return response.error(res, 404, err.message);
                }

                response.success(res, 200, tasks);
              });
            }

            _context3.next = 12;
            break;

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](2);
            response.error(res, 500, _context3.t0.message);

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 9]]);
  }));

  return function getTasksAssignedToUser(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}(); // export const getTasksAssignedByMe = async(req, res) => {
//     // const { username } = req.params;
//     try {
//         if(req.user) { 
//             Task.find({ assignedBy: req.user._id}, (err, tasks) => {
//                 if(err) { return response.error(res, 404, err.message) }
//                 response.success(res, 200, tasks);
//             })
//         } 
//     }catch (error) {
//         response.error(res, 500, error.message)
//     }
// }


var getFilesAssignedToTask = /*#__PURE__*/exports.getFilesAssignedToTask = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var id, Task, taskFiles;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = req.params.id;
            Task = req.dbModels.Task;
            _context4.prev = 2;
            _context4.next = 5;
            return Task.findById(id).populate('files');

          case 5:
            taskFiles = _context4.sent;

            if (taskFiles) {
              response.success(res, 201, taskFiles);
            }

            _context4.next = 12;
            break;

          case 9:
            _context4.prev = 9;
            _context4.t0 = _context4["catch"](2);
            response.error(res, 500, _context4.t0.message);

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[2, 9]]);
  }));

  return function getFilesAssignedToTask(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var addDeadlineToTask = exports.addDeadlineToTask = function addDeadlineToTask(req, res) {
  var id = req.params.id;
  var deadline = req.body.deadline;
  var Task = req.dbModels.Task;
  Task.findById(id, function (err, task) {
    if (err) response.success(res, 500, err);

    if (!task.deadline) {
      task.deadline = Date.parse(deadline);
      console.log(task.deadline);
      task.save().then(response.success(res, 200, 'Task deadline added'));
    }

    return response.error(res, 404, 'Deadline already added to this task');
  });
};
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addDeadlineToTask = exports.getFilesAssignedToTask = exports.getTasksAssignedToUser = exports.addFiletoTask = exports.createTask = exports["default"] = void 0;

var _Task = require("../models/Task");

var _Organization = require("../models/Organization");

var _crud = require("../../utils/crud");

var _User = require("../models/User");

var _File = require("../models/File");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// import moment from 'moment';
var response = require("../middlewares/response");

var moment = require('moment');

var _default = (0, _crud.crudControllers)(_Task.Task); //Create Task
// Route: org/:urlname/task/add/:username


exports["default"] = _default;

var createTask =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var _req$params, urlname, username, _req$body, title, description, org;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$params = req.params, urlname = _req$params.urlname, username = _req$params.username;
            _req$body = req.body, title = _req$body.title, description = _req$body.description;
            _context.prev = 2;
            _context.next = 5;
            return _Organization.Organization.findOne({
              urlname: urlname
            });

          case 5:
            org = _context.sent;

            if (!org.employees.includes(req.user._id)) {
              _context.next = 10;
              break;
            }

            _Task.Task.create({
              title: title,
              description: description
            }, function (err, task) {
              if (err) {
                return response.error(res, 404, err.nessage);
              }

              _User.User.findOne({
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

            _context.next = 11;
            break;

          case 10:
            return _context.abrupt("return", response.error(res, 404, "User is not an employee "));

          case 11:
            _context.next = 16;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](2);
            return _context.abrupt("return", response.error(res, 500, "Could not find organization"));

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 13]]);
  }));

  return function createTask(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); // Add a file to a task
//Route: org/:urlname/task/:id/add/file/:fileId


exports.createTask = createTask;

var addFiletoTask =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var _req$params2, urlname, id, fileId, org;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$params2 = req.params, urlname = _req$params2.urlname, id = _req$params2.id, fileId = _req$params2.fileId;
            _context2.prev = 1;
            _context2.next = 4;
            return _Organization.Organization.findOne({
              urlname: urlname
            });

          case 4:
            org = _context2.sent;

            if (org.employees.includes(req.user._id)) {
              _Task.Task.findById(id, function (err, task) {
                if (err) {
                  return response.error(res, 404, err.message);
                }

                _File.File.findById(fileId, function (err, file) {
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

  return function addFiletoTask(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}(); //Get tasks assigned to a User
//Route: org/:urlname/task/assignedto/:username


exports.addFiletoTask = addFiletoTask;

var getTasksAssignedToUser =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res) {
    var username, user;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            username = req.params.username;
            _context3.prev = 1;
            _context3.next = 4;
            return _User.User.findOne({
              username: username
            });

          case 4:
            user = _context3.sent;

            if (user) {
              _Task.Task.find({
                assignedTo: user._id
              }, function (err, tasks) {
                if (err) {
                  return response.error(res, 404, err.message);
                }

                response.success(res, 200, tasks);
              });
            }

            _context3.next = 11;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](1);
            response.error(res, 500, _context3.t0.message);

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 8]]);
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


exports.getTasksAssignedToUser = getTasksAssignedToUser;

var getFilesAssignedToTask =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(req, res) {
    var id, taskFiles;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = req.params.id;
            _context4.prev = 1;
            _context4.next = 4;
            return _Task.Task.findById(id).populate('files');

          case 4:
            taskFiles = _context4.sent;

            if (taskFiles) {
              response.success(res, 201, taskFiles);
            }

            _context4.next = 11;
            break;

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4["catch"](1);
            response.error(res, 500, _context4.t0.message);

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 8]]);
  }));

  return function getFilesAssignedToTask(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getFilesAssignedToTask = getFilesAssignedToTask;

var addDeadlineToTask = function addDeadlineToTask(req, res) {
  var id = req.params.id;
  var deadline = req.body.deadline;

  _Task.Task.findById(id, function (err, task) {
    if (err) response.success(res, 500, err);

    if (!task.deadline) {
      task.deadline = Date.parse(deadline);
      console.log(task.deadline);
      task.save().then(response.success(res, 200, 'Task deadline added'));
    }

    return response.error(res, 404, 'Deadline already added to this task');
  });
};

exports.addDeadlineToTask = addDeadlineToTask;
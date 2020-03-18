"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadFile = uploadFile;
exports.updateFileDetails = updateFileDetails;
exports.fetchFilesByUser = fetchFilesByUser;
exports.fetchAllOrgFiles = exports["default"] = void 0;

var _File = require("../models/File");

var _Organization = require("../models/Organization");

var _crud = require("../../utils/crud");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var response = require('../middlewares/response');

var _default = (0, _crud.crudControllers)(_File.File);

exports["default"] = _default;

function uploadFile(_x, _x2, _x3) {
  return _uploadFile.apply(this, arguments);
}

function _uploadFile() {
  _uploadFile = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res, next) {
    var _req$body, title, description, file;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$body = req.body, title = _req$body.title, description = _req$body.description;
            file = req.file;

            _File.File.create({
              title: title,
              description: description,
              fileLocationUrl: file.secure_url,
              uploadedBy: req.user._id
            }, function (err, file) {
              if (err) {
                response.error(res, 400, err);
              }

              _Organization.Organization.findOne({
                urlname: req.params.urlname
              }, function (err, org) {
                if (err) {
                  response.error(res, 404, err);
                }

                org.files.push(file._id);
                org.save();
                response.success(res, 200, "File uploaded successfully");
              });
            });

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _uploadFile.apply(this, arguments);
}

function updateFileDetails(_x4, _x5) {
  return _updateFileDetails.apply(this, arguments);
}

function _updateFileDetails() {
  _updateFileDetails = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res) {
    var _req$body2, title, description, file;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _req$body2 = req.body, title = _req$body2.title, description = _req$body2.description;
            _context3.next = 3;
            return _File.File.findById(req.params.id);

          case 3:
            file = _context3.sent;
            file.title = title;
            file.description = description;
            file.save(function (err) {
              if (err) {
                response.error(res, 404, err);
              }

              response.success(res, 200, "File Updated");
            });

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _updateFileDetails.apply(this, arguments);
}

function fetchFilesByUser(_x6, _x7) {
  return _fetchFilesByUser.apply(this, arguments);
}

function _fetchFilesByUser() {
  _fetchFilesByUser = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(req, res) {
    var urlname, orgFiles, files, org;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            urlname = req.params.urlname;
            orgFiles = [];
            _context4.prev = 2;
            _context4.next = 5;
            return _File.File.find({
              uploadedBy: req.user._id
            }).lean().exec();

          case 5:
            files = _context4.sent;
            _context4.next = 8;
            return _Organization.Organization.findOne({
              urlname: urlname
            });

          case 8:
            org = _context4.sent;

            if (!files) {
              response.error(res, 400, "No files owned by user ".concat(req.user.username));
            }

            files.forEach(function (file) {
              if (org.files.includes(file._id)) {
                orgFiles.push(file);
              }
            });

            if (!(orgFiles.length === 0)) {
              _context4.next = 13;
              break;
            }

            return _context4.abrupt("return", response.error(res, 404, "User has no files uploaded that belongs to this organization"));

          case 13:
            return _context4.abrupt("return", response.success(res, 200, orgFiles));

          case 16:
            _context4.prev = 16;
            _context4.t0 = _context4["catch"](2);
            response.error(res, 500, _context4.t0.message);

          case 19:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[2, 16]]);
  }));
  return _fetchFilesByUser.apply(this, arguments);
}

var fetchAllOrgFiles =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var urlname, orgFiles, files, org;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            urlname = req.params.urlname;
            orgFiles = [];
            _context.prev = 2;
            _context.next = 5;
            return _File.File.find({}).lean().exec();

          case 5:
            files = _context.sent;
            _context.next = 8;
            return _Organization.Organization.findOne({
              urlname: urlname
            });

          case 8:
            org = _context.sent;

            if (!files) {
              response.error(res, 400, "No files found");
            }

            files.forEach(function (file) {
              if (org.files.includes(file._id)) {
                orgFiles.push(file);
              }
            });

            if (!(orgFiles.length === 0)) {
              _context.next = 13;
              break;
            }

            return _context.abrupt("return", response.error(res, 404, "Organization has no files"));

          case 13:
            return _context.abrupt("return", response.success(res, 200, orgFiles));

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](2);
            response.error(res, 500, _context.t0.message);

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 16]]);
  }));

  return function fetchAllOrgFiles(_x8, _x9) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchAllOrgFiles = fetchAllOrgFiles;
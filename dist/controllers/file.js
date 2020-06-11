"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadFile = uploadFile;
exports.updateFileDetails = updateFileDetails;
exports.fetchFilesByUser = fetchFilesByUser;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var response = require('../middlewares/response');

function uploadFile(_x, _x2, _x3) {
  return _uploadFile.apply(this, arguments);
}

function _uploadFile() {
  _uploadFile = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
    var _req$body, title, description, file, _req$dbModels2, File, TenantOrganization;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _req$body = req.body, title = _req$body.title, description = _req$body.description;
            file = req.file;
            _req$dbModels2 = req.dbModels, File = _req$dbModels2.File, TenantOrganization = _req$dbModels2.TenantOrganization;
            File.create({
              title: title,
              description: description,
              fileLocationUrl: file.secure_url,
              uploadedBy: req.user._id
            }, function (err, file) {
              if (err) {
                response.error(res, 400, err);
              }

              TenantOrganization.findOne({
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

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _uploadFile.apply(this, arguments);
}

function updateFileDetails(_x4, _x5) {
  return _updateFileDetails.apply(this, arguments);
}

function _updateFileDetails() {
  _updateFileDetails = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var _req$body2, title, description, File, file;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _req$body2 = req.body, title = _req$body2.title, description = _req$body2.description;
            File = req.dbModels.File;
            _context4.next = 4;
            return File.findById(req.params.id);

          case 4:
            file = _context4.sent;
            file.title = title;
            file.description = description;
            file.save(function (err) {
              if (err) {
                response.error(res, 404, err);
              }

              response.success(res, 200, "File Updated");
            });

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _updateFileDetails.apply(this, arguments);
}

function fetchFilesByUser(_x6, _x7) {
  return _fetchFilesByUser.apply(this, arguments);
}

function _fetchFilesByUser() {
  _fetchFilesByUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    var urlname, orgFiles, _req$dbModels3, File, TenantOrganization, files, org;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            urlname = req.params.urlname;
            orgFiles = [];
            _req$dbModels3 = req.dbModels, File = _req$dbModels3.File, TenantOrganization = _req$dbModels3.TenantOrganization;
            _context5.prev = 3;
            _context5.next = 6;
            return File.find({
              uploadedBy: req.user._id
            }).lean().exec();

          case 6:
            files = _context5.sent;
            _context5.next = 9;
            return TenantOrganization.findOne({
              urlname: urlname
            });

          case 9:
            org = _context5.sent;

            if (!files) {
              response.error(res, 400, "No files owned by user ".concat(req.user.username));
            }

            files.forEach(function (file) {
              if (org.files.includes(file._id)) {
                orgFiles.push(file);
              }
            });

            if (!(orgFiles.length === 0)) {
              _context5.next = 14;
              break;
            }

            return _context5.abrupt("return", response.error(res, 404, "User has no files uploaded that belongs to this organization"));

          case 14:
            return _context5.abrupt("return", response.success(res, 200, orgFiles));

          case 17:
            _context5.prev = 17;
            _context5.t0 = _context5["catch"](3);
            response.error(res, 500, _context5.t0.message);

          case 20:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[3, 17]]);
  }));
  return _fetchFilesByUser.apply(this, arguments);
}

var fetchAllOrgFiles = /*#__PURE__*/exports.fetchAllOrgFiles = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var urlname, orgFiles, _req$dbModels, File, TenantOrganization, files, org;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            urlname = req.params.urlname;
            orgFiles = [];
            _req$dbModels = req.dbModels, File = _req$dbModels.File, TenantOrganization = _req$dbModels.TenantOrganization;
            _context.prev = 3;
            _context.next = 6;
            return File.find({}).lean().exec();

          case 6:
            files = _context.sent;
            _context.next = 9;
            return TenantOrganization.findOne({
              urlname: urlname
            });

          case 9:
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
              _context.next = 14;
              break;
            }

            return _context.abrupt("return", response.error(res, 404, "Organization has no files"));

          case 14:
            return _context.abrupt("return", response.success(res, 200, orgFiles));

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](3);
            response.error(res, 500, _context.t0.message);

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 17]]);
  }));

  return function fetchAllOrgFiles(_x8, _x9) {
    return _ref.apply(this, arguments);
  };
}();

var getOneById = /*#__PURE__*/exports.getOneById = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var File, doc;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            File = req.dbModels.File;
            _context2.prev = 1;
            _context2.next = 4;
            return File.findById(req.params.id).lean().exec();

          case 4:
            doc = _context2.sent;

            if (doc) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt("return", res.status(404).end());

          case 7:
            res.status(200).json({
              data: doc
            });
            _context2.next = 14;
            break;

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](1);
            console.error(_context2.t0);
            res.status(400).end();

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 10]]);
  }));

  return function getOneById(_x10, _x11) {
    return _ref2.apply(this, arguments);
  };
}();
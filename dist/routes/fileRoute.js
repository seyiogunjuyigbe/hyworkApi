"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _multer = require("../../utils/multer");

var _file = _interopRequireWildcard(require("../controllers/file"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var router = require('express').Router();

var parser = require('../../utils/cloudinary');

var authUser = require("../middlewares/middleware");

var orgMiddleware = require('../middlewares/organization');

router.get('/:urlname/file/allfiles', [authUser.orgExists, authUser.authUser, orgMiddleware.LoggedUserisAdmin], _file.fetchAllOrgFiles);
router.get('/:urlname/file/myfiles', [authUser.orgExists, authUser.authUser, orgMiddleware.LoggedUserisEmployee], _file.fetchFilesByUser);
router.get('/:urlname/file/:id', [authUser.orgExists, authUser.authUser], _file.getOneById);
router.post('/:urlname/file/:id', [authUser.orgExists, authUser.authUser, orgMiddleware.LoggedUserisEmployee], _file.updateFileDetails);
router.patch('/:urlname/file/upload', [authUser.orgExists, authUser.authUser, parser.single('file')], _file.uploadFile); // router.delete('/:id', controllers.removeOne)

module.exports = router;
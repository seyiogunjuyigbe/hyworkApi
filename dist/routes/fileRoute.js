"use strict";

var _multer = require("../utils/multer");

var _file = require("../controllers/file");

var _file2 = _interopRequireDefault(_file);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = require('express').Router();

var parser = require('../utils/cloudinary');

var authUser = require("../middlewares/middleware");

var orgMiddleware = require('../middlewares/organization');

router.get('/:urlname/file/allfiles', [authUser.orgExists, authUser.authUser, orgMiddleware.LoggedUserisAdmin], _file.fetchAllOrgFiles);
router.get('/:urlname/file/myfiles', [authUser.orgExists, authUser.authUser, orgMiddleware.LoggedUserisEmployee], _file.fetchFilesByUser);
router.get('/:urlname/file/:id', [authUser.orgExists, authUser.authUser], _file.getOneById);
router.post('/:urlname/file/:id', [authUser.orgExists, authUser.authUser, orgMiddleware.LoggedUserisEmployee], _file.updateFileDetails);
router.patch('/:urlname/file/upload', [authUser.orgExists, authUser.authUser, parser.single('file')], _file.uploadFile); // router.delete('/:id', controllers.removeOne)

module.exports = router;
const router = require('express').Router();
import { upload } from '../utils/multer';
import { uploadFile, fetchAllFiles, fetchFilesByUser, updateFileDetails, fetchAllOrgFiles, getOneById, uploadFileByDepartment } from "../controllers/file";
import controllers from "../controllers/file";
const parser = require('../utils/cloudinary');
const authUser = require("../middlewares/middleware");
const orgMiddleware = require('../middlewares/organization');

router.get('/:urlname/file/allfiles', [authUser.orgExists, authUser.authUser, orgMiddleware.LoggedUserisAdmin], fetchAllOrgFiles);
router.get('/:urlname/file/myfiles', [authUser.orgExists, authUser.authUser, orgMiddleware.LoggedUserisEmployee], fetchFilesByUser);
router.get('/:urlname/file/:id', [authUser.orgExists, authUser.authUser], getOneById);
router.post('/:urlname/file/:id', [authUser.orgExists, authUser.authUser, orgMiddleware.LoggedUserisEmployee], updateFileDetails);
router.patch('/:urlname/file/upload', [authUser.orgExists, authUser.authUser, parser.single('file')], uploadFile);
router.patch('/:urlname/file/upload/dept/:deptId', [authUser.orgExists, authUser.authUser, parser.single('file')], uploadFileByDepartment);
// router.delete('/:id', controllers.removeOne)


module.exports = router;
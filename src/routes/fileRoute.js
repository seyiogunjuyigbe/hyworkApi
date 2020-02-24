const router = require('express').Router();
import { upload } from '../../utils/multer';
import { uploadFile, fetchAllFiles, fetchFilesByUser, updateFileDetails, fetchById } from "../controllers/file";
import controllers from "../controllers/file";
const parser = require('../../utils/cloudinary');
const authUser = require("../middlewares/middleware");

router.get('/allfiles', [authUser.orgExists, authUser.authUser, authUser.isAdmin], controllers.getMany);
router.get('/myfiles', [authUser.orgExists, authUser.authUser], fetchFilesByUser);
router.get('/:id', [authUser.orgExists, authUser.authUser], controllers.getOneById);
router.post('/:id', [authUser.orgExists, authUser.authUser], updateFileDetails);
router.patch('/upload', [authUser.orgExists, authUser.authUser, parser.single('file')], uploadFile);
// router.delete('/:id', controllers.removeOne)


module.exports = router;
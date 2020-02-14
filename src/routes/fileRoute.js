const router = require('express').Router();
import { upload } from '../../utils/multer';
import { uploadFile, fetchAllFiles, fetchFilesByUser, updateFileDetails, fetchById } from "../controllers/file";
import controllers from "../controllers/file";
const parser = require('../../utils/cloudinary');
const authUser = require("../middlewares/middleware");

router.get('/allFiles', [authUser.authUser, authUser.isAdmin], controllers.getMany);
router.get('/myfiles', [authUser.authUser], fetchFilesByUser);
router.get('/:id', [authUser.authUser], controllers.getOneById);
router.post('/:id', [authUser.authUser], updateFileDetails);
router.post('/upload', parser.array('file'), uploadFile);
// router.delete('/:id', controllers.removeOne)


module.exports = router;
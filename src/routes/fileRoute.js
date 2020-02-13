const router = require('express').Router();
import { upload } from '../../utils/multer';
import { uploadFile, fetchAllFiles, fetchFilesByUser, updateFileDetails, fetchById } from "../controllers/fileManagementController";
import controllers from "../controllers/fileManagementController";
const authUser = require("../middlewares/middleware");

router.get('/all', [authUser.authUser, authUser.isAdmin], controllers.getMany);
router.get('/myfiles', [authUser.authUser], fetchFilesByUser);
router.get('/:id', [authUser.authUser], controllers.getOneById);
router.post('/:id', [authUser.authUser], updateFileDetails);
router.post('/upload', [ authUser.authUser , upload.single('file')], uploadFile);
// router.delete('/:id', controllers.removeOne)


module.exports = router;
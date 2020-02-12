const router = require('express').Router();
import { upload } from '../../utils/multer';
import { uploadFile, fetchAllFiles, fetchFilesByUser } from "../controllers/fileManagementController";
const authUser = require("../middlewares/middleware");

router.get('/all', [authUser.authUser, authUser.isAdmin], fetchAllFiles);
router.get('/myfiles', [authUser.authUser], fetchFilesByUser);
router.post('/upload', [ authUser.authUser , upload.single('file')], uploadFile);


module.exports = router;
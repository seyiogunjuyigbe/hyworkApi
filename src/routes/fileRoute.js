const router = require('express').Router();
import { upload } from '../../utils/multer';
import { uploadFile } from "../controllers/fileManagementController";
const authUser = require("../middlewares/middleware");


router.post('/upload', [ authUser.authUser , upload.single('file')], uploadFile);


module.exports = router;
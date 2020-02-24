const express = require('express');
const router = express.Router();
const authUser = require('../middlewares/middleware');
const { check } = require('express-validator');
const validate = require("../middlewares/validate");
import { addPhoneNumber, updateBioData } from '../controllers/user';

router.post('/addPhoneNumber', [ authUser.authUser ], addPhoneNumber);
router.post('/addBioData', [ authUser.authUser ], updateBioData);



module.exports = router;
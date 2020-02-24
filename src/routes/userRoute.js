const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validate = require("../middlewares/validate");
import { addPhoneNumber, addBioData } from '../controllers/user';

router.post('/addPhoneNumber', addPhoneNumber)



module.exports = router;
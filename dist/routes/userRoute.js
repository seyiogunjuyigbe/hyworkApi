"use strict";

var _user = require("../controllers/user");

var express = require('express');

var router = express.Router();

var authUser = require('../middlewares/middleware');

var _require = require('express-validator'),
    check = _require.check;

var validate = require("../middlewares/validate");

router.post('/addPhoneNumber', [authUser.authUser], _user.addPhoneNumber);
router.post('/addBioData', [authUser.authUser], _user.updateBioData);
module.exports = router;
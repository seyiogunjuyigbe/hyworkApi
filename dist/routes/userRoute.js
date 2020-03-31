"use strict";

var _user = require("../controllers/user");

var express = require('express');

var router = express.Router();

var authUser = require('../middlewares/middleware');

var _require = require('express-validator'),
    check = _require.check;

var validate = require("../middlewares/validate");

router.post('/:urlname/user/:username/addPhoneNumber', _user.addPhoneNumber);
router.post('/:urlname/user/:username/updateBioData', _user.updateBioData);
router.post('/:urlname/user/:username/addDependent', [check("firstName").not().isEmpty().withMessage("Enter First Name of Dependent"), check("lastName").not().isEmpty().withMessage("Enter Last Name of Dependent"), check("relationship").not().isEmpty().withMessage("Enter Relationship of Dependent with Employee"), check("phoneNumber").not().isEmpty().withMessage("Enter Phone Number of Dependent"), check("email").isEmail().withMessage("Enter Valid email of Dependent")], [validate], _user.addDependentToUser);
router.get('/:urlname/user/:username/removeDependent', _user.removeDependentFromUser);
module.exports = router;
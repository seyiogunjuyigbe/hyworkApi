const express = require('express');
const router = express.Router();
const authUser = require('../middlewares/middleware');
const { check } = require('express-validator');
const validate = require("../middlewares/validate");
import { addPhoneNumber, updateBioData, addDependentToUser, removeDependentFromUser } from '../controllers/user';

router.post('/:urlname/user/:username/addPhoneNumber', addPhoneNumber);
router.post('/:urlname/user/:username/updateBioData', updateBioData);
router.post('/:urlname/user/:username/addDependent', [
    check("firstName").not().isEmpty().withMessage("Enter First Name of Dependent"),
    check("lastName").not().isEmpty().withMessage("Enter Last Name of Dependent"),
    check("relationship").not().isEmpty().withMessage("Enter Relationship of Dependent with Employee"),
    check("phoneNumber").not().isEmpty().withMessage("Enter Phone Number of Dependent"),
    check("email").isEmail().withMessage("Enter Valid email of Dependent")
],[validate],addDependentToUser);
router.get('/:urlname/user/:username/removeDependent', removeDependentFromUser);



module.exports = router;
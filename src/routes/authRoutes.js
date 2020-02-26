const express = require('express');
const validate = require('../middlewares/validate');
const { check } = require('express-validator');
import { registerNewUser, loginUser, loginCb, verifyToken, resendToken, logoutUser, renderLoginPage, renderSignUpPage } from "../controllers/auth";
import {recover, reset, resetPassword, changePassword, recoverPass }from '../controllers/password'
const router = express.Router();
router.get('/register', renderSignUpPage)
router.post('/register', [
    check('firstName').not().isEmpty().withMessage('You first name is required'),
    check('lastName').not().isEmpty().withMessage('You last name is required'),
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('username').not().isEmpty().withMessage('You username is required'),
    check('password').not().isEmpty().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i").withMessage('Password must be at least 8 characters long and must include one lowercase character, one uppercase character, a number, and a special character'),
], registerNewUser);
router.get('/login', renderLoginPage)
router.post("/login", [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').not().isEmpty().withMessage('Please enter the password for this account'),
], loginUser, loginCb);

router.get('/logout', logoutUser);
router.get('/verify/:token', verifyToken);
router.post('/token/resend', resendToken);


    //Password RESET
router.get('/password/recover', recoverPass)
router.post('/password/recover', [
    check('email').isEmail().withMessage('Enter a valid email address'),
], validate, recover);

router.get('/password/reset/:token', reset);
router.post('/password/reset/:token', [
    check('password').not().isEmpty().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i").withMessage('Password must be at least 8 characters long and must include one lowercase character, one uppercase character, a number, and a special character'),
    check('confirmPassword', 'Passwords do not match').custom((value, {req}) => (value === req.body.password)),
        ], validate, resetPassword);

router.post('/password/change', [
    check('password').not().isEmpty().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i").withMessage('Password must be at least 8 characters long and must include one lowercase character, one uppercase character, a number, and a special character'),
    check('confirmPassword', 'Passwords do not match').custom((value, {req}) => (value === req.body.password)),
                ], validate, changePassword);

module.exports = router;
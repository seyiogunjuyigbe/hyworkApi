const express = require('express');
const validate = require('../middlewares/validate');
const { check } = require('express-validator');
import { registerNewUser, loginUser, loginCb, verifyToken, resendToken, logoutUser } from "../controllers/auth";
import {recover, reset, resetPassword} from '../controllers/password'
import {clockIn, clockOut, fetchMyAttendance} from '../controllers/attendance';
const router = express.Router();
// import { getUserByUsername, getAllUsers } from '../controllers/userController';

router.post('/register', [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('username').not().isEmpty().withMessage('You username is required'),
    check('password').not().isEmpty().isLength({min: 8}).withMessage('Must be at least 8 chars long'),
    check('firstName').not().isEmpty().withMessage('You first name is required'),
    check('lastName').not().isEmpty().withMessage('You last name is required')
], validate, registerNewUser);

router.post("/login", [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').not().isEmpty().withMessage('Please enter the password for this account'),
], validate, loginUser, loginCb);

router.get('/login/success', (req,res)=>{
    console.log(res);
    return res.status(200).json({success:true,
    message: 'Successfully logged in',
    user: req.user.username})
});

router.get('/login/failure', (req,res)=>{
    return res.status(500).json({success:false,
    message: 'Sorry, we could not log you in' })
});

router.get('/logout', logoutUser);
router.get('/verify/:token', verifyToken);
router.post('/token/resend', resendToken);


    //Password RESET
router.post('/password/recover', [
    check('email').isEmail().withMessage('Enter a valid email address'),
], validate, recover);

router.get('/password/reset/:token', reset);
router.post('/password/reset/:token', [
            check('password').not().isEmpty().isLength({min: 8}).withMessage('Must be at least 8 chars long'),
            check('confirmPassword', 'Passwords do not match').custom((value, {req}) => (value === req.body.password)),
        ], validate, resetPassword);
router.post('/clockin', clockIn)        
router.post('/clockout', clockOut);
router.get('/attendance', fetchMyAttendance)

module.exports = router;
"use strict";

var _auth = require("../controllers/auth");

var _password = require("../controllers/password");

var express = require('express');

var validate = require('../middlewares/validate');

var _require = require('express-validator'),
    check = _require.check;

var router = express.Router();
router.get('/register', _auth.renderSignUpPage);
router.post('/register', [check('firstName').not().isEmpty().withMessage('You first name is required'), check('lastName').not().isEmpty().withMessage('You last name is required'), check('email').isEmail().withMessage('Enter a valid email address'), check('username').not().isEmpty().withMessage('You username is required'), check('password').not().isEmpty().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i").withMessage('Password must be at least 8 characters long and must include one lowercase character, one uppercase character, a number, and a special character')], _auth.registerNewUser);
router.get('/login', _auth.renderLoginPage);
router.post("/login", [check('email').isEmail().withMessage('Enter a valid email address'), check('password').not().isEmpty().withMessage('Please enter the password for this account')], _auth.loginUser, _auth.loginCb);
router.get('/logout', _auth.logoutUser);
router.get('/verify/:token', _auth.verifyToken);
router.post('/token/resend', _auth.resendToken); //Password RESET

router.get('/password/recover', _password.recoverPass);
router.post('/password/recover', [check('email').isEmail().withMessage('Enter a valid email address')], _password.recover);
router.get('/password/reset/:token', _password.reset);
router.post('/password/reset/:token', [check('password').not().isEmpty().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i").withMessage('Password must be at least 8 characters long and must include one lowercase character, one uppercase character, a number, and a special character'), check('confirmPassword', 'Passwords do not match').custom(function (value, _ref) {
  var req = _ref.req;
  return value === req.body.password;
})], _password.resetPassword);
router.post('/password/change', [check('password').not().isEmpty().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i").withMessage('Password must be at least 8 characters long and must include one lowercase character, one uppercase character, a number, and a special character'), check('confirmPassword', 'Passwords do not match').custom(function (value, _ref2) {
  var req = _ref2.req;
  return value === req.body.password;
})], validate, _password.changePassword);
module.exports = router;
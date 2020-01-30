import { registerNewUser, loginUser, verifyToken, resendToken } from "../controllers/auth";
import {recover, reset, resetPassword} from '../controllers/password'
const validate = require("../middlewares/validate");
const {check} = require('express-validator');
export const initRoutes = app =>{
    app.get('/', (req,res)=>{
        res.send('Hello World!')
    });
    app.post('/user/register', [
        check('email').isEmail().withMessage('Enter a valid email address'),
        check('username').not().isEmpty().withMessage('You username is required'),
        check('password').not().isEmpty().isLength({min: 8}).withMessage('Must be at least 8 chars long'),
        check('firstName').not().isEmpty().withMessage('You first name is required'),
        check('lastName').not().isEmpty().withMessage('You last name is required')
    ], validate, registerNewUser);

    app.post("/user/login", [
        check('email').isEmail().withMessage('Enter a valid email address'),
        check('password').not().isEmpty(),
    ], validate, loginUser)
    app.get('/user/verify/:token', verifyToken);
    app.post('user/token/resend', resendToken);

    //Password RESET
    app.post('/user/password/recover', [
            check('email').isEmail().withMessage('Enter a valid email address'),
        ], validate, recover);

    app.get('/user/password/reset/:token', reset);
    app.post('/user/password/reset/:token', [
            check('password').not().isEmpty().isLength({min: 8}).withMessage('Must be at least 8 chars long'),
            check('confirmPassword', 'Passwords do not match').custom((value, {req}) => (value === req.body.password)),
        ], validate, resetPassword);
         }
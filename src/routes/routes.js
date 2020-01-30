import { registerNewUser, loginUser, verifyToken, resendToken } from "../controllers/auth";
import {recover, reset, resetPassword} from '../controllers/password'
const userRouter = require('../routes/userRoute.js');
const validate = require("../middlewares/validate");
const {check} = require('express-validator');
export const initRoutes = app =>{
    app.get('/', (req,res)=>{
        res.send('Hello World!')
    });
    app.use('/user', userRouter);
}
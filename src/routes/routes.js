import { registerNewUser, loginUser, verifyToken, resendToken } from "../controllers/auth";
import {recover, reset, resetPassword} from '../controllers/password'
const userRouter = require('../routes/userRoute.js');
const locationRoute = require('../routes/locationRoute.js');
const organizationRoute = require('../routes/organizationRoute');
const fileRoute = require('./fileRoute');

const validate = require("../middlewares/validate");
const {check} = require('express-validator');
export const initRoutes = app =>{
    app.get('/', (req,res)=>{
        res.send('Hello World!')
    });
    
    app.use('/auth', authRouter);
    app.use('/org/:urlname/u', userRouter);
    app.use('/org/:urlname', attendanceRouter);
    app.use('/org/:urlname/shifts', shiftRouter);
    app.use('/location', locationRoute);
    app.use('/org', organizationRouter);
}
import { registerNewUser, loginUser, verifyToken, resendToken } from "../controllers/auth";
import {recover, reset, resetPassword} from '../controllers/password'
const authRouter = require('../routes/authRoutes')
const userRouter = require('../routes/userRoute.js');
const locationRouter = require('../routes/locationRoute.js');
const organizationRouter = require('../routes/organizationRoute');
const fileRouter = require('../routes/fileRoute');
const attendanceRouter = require('../routes/attendanceRoutes.js');
const shiftRouter = require('../routes/shiftRoutes.js');
const departmentRouter = require('../routes/departmentRouter');
const taskRouter = require('../routes/taskRoutes');
const validate = require("../middlewares/validate");
const {check} = require('express-validator');
export const initRoutes = app => {
    app.get('/', (req,res)=>{
        res.send('Hello World!')
    });
    
    app.use('/auth', authRouter);
    app.use('/org/:urlname/u', userRouter);
    app.use('/org/:urlname/attendance', attendanceRouter);
    app.use('/org/:urlname/shifts', shiftRouter);
    app.use('/location', locationRouter);
    app.use('/org', organizationRouter);
    app.use('/org', fileRouter);
    app.use('/org', departmentRouter);
    app.use('/org', taskRouter);



}
import { registerNewUser, loginUser, verifyToken, resendToken } from "../controllers/auth";
import {recover, reset, resetPassword} from '../controllers/password';
const authRouter = require('./authRoutes');
const userRouter = require('./userRoute.js');
// const locationRouter = require('./locationRoute.js');
const organizationRouter = require('./organizationRoute');
const fileRouter = require('./fileRoute');
const attendanceRouter = require('./attendanceRoutes.js');
const shiftRouter = require('./shiftRoutes.js');
const departmentRouter = require('./departmentRouter');
const leaveRouter = require('./leaveRoutes');
const benefitRouter = require('../routes/benefitRoutes');
const caseRouter = require('./caseRoutes');
const taskRouter = require('./taskRoutes');
const assetRouter = require('./assetRoutes');
const travelRouter = require('./travelRoutes')
const jobRouter = require ('./jobRoutes');
const ratingRouter = require('./rating');
import {authUser} from '../middlewares/middleware'
export const initRoutes = app => {
    app.get('/', authUser, (req,res)=>{
        return res.redirect('/org')
    });
    app.use('/auth', authRouter);
    app.use('/org', organizationRouter);
    app.use('/org', userRouter);
    app.use('/org', attendanceRouter);
    app.use('/org', shiftRouter);
    app.use('/org', ratingRouter)
    // app.use('/location', locationRouter);
    app.use('/org', fileRouter);
    app.use('/org', departmentRouter);
    app.use('/org', leaveRouter); 
    app.use('/org', taskRouter);
    app.use('/org', benefitRouter);
    app.use('/org', caseRouter);
    app.use('/org', assetRouter);
    app.use('/org', travelRouter);
    app.use('/org', jobRouter);
}

const userRouter = require('./userRoute');
const authRouter = require('./authRoutes');
const locationRoute = require('./locationRoute');
const attendanceRouter = require('./attendanceRoutes')
const organizationRouter = require('./organizationRoute')
const shiftRouter = require('./shiftRoutes');
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
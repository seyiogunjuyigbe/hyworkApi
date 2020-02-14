const userRouter = require('./userRoute');
const authRouter = require('./authRoutes');
const locationRoute = require('./locationRoute');
const attendanceRouter = require('./attendanceRoutes')
const organizationRouter = require('./organizationRoute')

export const initRoutes = app =>{
    app.get('/', (req,res)=>{
        res.send('Hello World!')
    });
    
    app.use('/auth', authRouter);
    app.use('/org/:urlName/u', userRouter);
    app.use('/org/:urlName/attendance', attendanceRouter)
    app.use('/location', locationRoute);
    app.use('/org', organizationRouter);
}
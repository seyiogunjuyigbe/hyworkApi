const userRouter = require('./userRoute');
const authRouter = require('./authRoutes');
const locationRoute = require('./locationRoute');
const attendanceRouter = require('./attendanceRoutes')
const organisationRouter = require('./organisationRoutes')

export const initRoutes = app =>{
    app.get('/', (req,res)=>{
        res.send('Hello World!')
    });
    
    app.use('/auth', authRouter);
    app.use('/org/:name', organisationRouter)
    app.use('/org/:name/u', userRouter);
    app.use('/org/:name/attendance', attendanceRouter)
    app.use('/location', locationRoute);
    app.use('/organization', organizationRoute);
}
import userRoute from './userRoute';
import locationRoute from './locationRoute';

export const initRoutes = app =>{
    app.get('/', (req,res)=>{
        res.send('Hello World!')
    });

    app.use('/api/user', userRoute);
    app.use('/api/location', locationRoute);

}


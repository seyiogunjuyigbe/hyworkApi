const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
import {DB_URL}  from '../config/constants';
export const startDb = () =>{
    mongoose.connect(DB_URL, {
        useNewUrlParser: true, 
        useFindAndModify: false, 
        useCreateIndex:true,
        useUnifiedTopology: true
        }, (err,done) => {
          if(err){
            console.error(err);
          } else{
            console.log('Database connected to: ' + DB_URL);

          }
      })
      
}
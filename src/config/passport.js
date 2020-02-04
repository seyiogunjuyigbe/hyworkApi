const passport  = require('passport');
import {User} from '../models/User';
const LocalStrategy = require('passport-local').Strategy;
export const passportConfig = (passport) =>{
    passport.use(User.createStrategy());
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    }, function(req, email, password, done) {
        User.findOne({email: req.body.email })
            .then(function(user, err) {
            if (err){
                console.log("err", err);
                return done(err);  
            }        // if no user is found, return the message
            if (!user){
                console.log("no user found");
                return done(null, false, console.log('loginMessage', 'No user found.')); 
            }
            if (!user.comparePassword(password)){
                return done(null, false, console.log('Invalid email and passsword combination'))
            }
            // Make sure the user has been verified
            if (!user.isVerified) {
                return done(null, false, console.log('Your email is not yet verified'))
            }
                return done(null, user);
         });
    
    }));
    
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
}
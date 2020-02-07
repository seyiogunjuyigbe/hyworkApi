const passport  = require('passport');
import {User} from '../models/User';
const LocalStrategy = require('passport-local').Strategy;
export const passportConfig = (passport) =>{
   passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use("local", new LocalStrategy(User.authenticate()));
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
        } 
        if (!user){
            console.log("no user found");
            return done(null, false, {message: 'No user found'}); 
        }
        // Make sure the user has been verified
        if (!user.isVerified) {
            return done(null, false)
        }
            return done(null, user);
     })
    }))
}
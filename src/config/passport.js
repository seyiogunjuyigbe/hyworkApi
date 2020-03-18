const passport  = require('passport');
import {User} from '../models/User';
const LocalStrategy = require('passport-local').Strategy;
export const passportConfig = (passport) =>{
   passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use("local", new LocalStrategy(User.authenticate()));
passport.use(User.createStrategy());

}
const passport  = require('passport');
import {User} from '../models/User';
const app = require('express')()
const LocalStrategy = require('passport-local');
export const passportConfig = (app,passport) =>{
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use("local", new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
}
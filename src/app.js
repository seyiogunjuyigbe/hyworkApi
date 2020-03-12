const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');
const geoip = require ('geoip-lite');
const subdomain = require('express-subdomain');
const { connect, getDBInstance } = require('./database/multiDb.js');


import path from 'path';
import {startDb} from './database/db';
import { getOrganization } from './middlewares/organization';
import {SECRET_KEY, SITE_URL, MAIL_PASS, MAIL_SENDER, MAIL_USER, MAIL_SERVICE} from "./config/constants"
import { initRoutes, tenantRoutes } from './routes/routes'
import { User } from './models/User';
import { Organization } from './models/Organization';


startDb();
connect();
app.set('views', path.join(__dirname, 'views')) // Redirect to the views directory inside the src directory
app.use(express.static(path.join(__dirname, '../public'))); // load local css and js files
app.set('view engine', 'ejs'); 
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false, 
    expires: new Date(Date.now() + (30 * 80000 * 1000))
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    req.dbModels = getDBInstance(req.params.urlname.toLowerCase()).models;
    next();
});

initRoutes(app);
// Organization.findOne({urlname: 'alpha'}).populate('employees',"username email -_id")
// .then((org)=>{
//     var list = [];
//     org.employees.forEach(guy=>list.push(guy.username));
//     console.log(org.employees)
// })
// .catch(err=>console.log(err))
const PORT = process.env.PORT
app.all('*', (req,res)=>{return res.status(404).json({message: 'You seem lost... no resource found'})})
app.listen(PORT, process.env.IP, ()=>{
    console.log(`Listening on ${PORT}`)
})
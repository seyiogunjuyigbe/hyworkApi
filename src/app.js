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
const geoip = require('geoip-lite');
const subdomain = require('express-subdomain');
const { connect, getDBInstance } = require('./database/multiDb.js');


import path from 'path';
import { startDb } from './database/db';
import { getOrganization } from './middlewares/organization';
import { SECRET_KEY } from "./config/constants"
import { initRoutes, tenantRoutes } from './routes/routes'



startDb();
connect();
app.set('views', path.join(__dirname, 'views')) // Redirect to the views directory inside the src directory
app.use(express.static(path.join(__dirname, '../public'))); // load local css and js files
app.set('view engine', 'ejs');
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    expires: new Date(Date.now() + (30 * 80000 * 1000)),
    cookie:{
        maxAge: 30 * 80000 * 1000
    }
})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
app.use('/org/:urlname',function(req,res,next){
    req.dbModels = getDBInstance(req.params.urlname.toLowerCase()).models;
    if(req.session.userId == undefined) {
        return next()
    }
    else{
        let userId = req.session.userId
        let {User} = req.dbModels;
        User.findById(userId,(err,user)=>{
            if(user){ 
             req.user = user;
             res.locals.currentUser = req.user;   
             return next()
            }
            else if(!user) { return next()}
        })   
        }
})

initRoutes(app);

const PORT = process.env.PORT
app.all('*', (req, res) => { return res.status(404).json({ message: 'You seem lost... no resource found' }) })
app.listen(PORT, process.env.IP, () => {
    console.log(`Listening on ${PORT}`)
})
import {User} from '../models/User';
import{Token} from '../models/Token'
const passport = require('passport');
import {sendTokenMail} from '../middlewares/mail';
import {passportConfig} from '../config/passport';
import { Organization } from '../models/Organization';
passportConfig(passport,User);
const {validationResult} = require('express-validator');


// Render Register Page
// @route GET /auth/register
export const renderSignUpPage = (req,res)=>{
return res.status(200).render('register', {err:null})
}



// Register new Admin
// @route POST /auth/register.
export const registerNewUser = (req, res) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    let error = []; errors.array().map((err) => error.push(err.msg));
    return res.status(422).render('register',{err: error});
    } else{      
    User.findOne({email: req.body.email})
    .then((user)=>{
        if(user) return res.status(403).render('register', {err: 'A user with this email already exists'}) 
    })
    .catch((error)=>{ return res.status(500).render('500')})
    User.findOne({username: req.body.username})
    .then((user)=>{
        if(user)return res.status(403).render('register', {err: 'This username is already taken'})
        else{
            let newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                role: 'admin'
            });
            newUser.username = req.body.username;
            User.register(newUser, req.body.password, function(err,user){
              if(err){
                  console.log(err);
                  return res.status(500).render('register',{success:false, err: err.message});
              }
              else{
                passport.authenticate("local")(req, res, function(){
                    sendTokenMail(newUser,req,res);
                    newUser.save();
                   })
    }
     })   
                
        }
    })
    .catch((error)=>{return res.status(500).render('500')})
}
}

// Render Login Page
// @ROUTE GET /auth/login
export const renderLoginPage = (req,res)=>{
    if(!req.user) return res.status(200).render('login', {url:"http://" + req.headers.host, err:null})
    else res.send('Hey, ' + req.user.username + ', You are already logged in')
}



// Login Existing User
// @route POST /auth/login
// export const loginUser = passport.authenticate('local-login')
   export const loginUser = (req,res, next)=>{  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    let error = []; errors.array().map((err) => error.push(err.msg));
    return res.status(422).render('login',{err: error});
    } else{ 
       User.findOne({email: req.body.email}, (err,user)=>{
           if(err){return res.status(500).render('error/500')}
           else if(!user){return res.status(403).render('login',{err: 'No user found with this email address'})}
           else {
               if(req.body.password){
                  user.authenticate(req.body.password, (err,found,passwordErr)=>{
                    if(err){
                        return res.status(500).render('error/500',{message: err.message})
                    } else if(passwordErr){
                        return res.status(403).render('login',{err: 'Incorrect password'})
                    } else if(found){
                        req.login(user, function(err) {
                            if(err){return res.status(500).render('error/500',{message: err.message})}
                            else if (!user.isVerified){
                                return res.status(200).json({
                                    success: true,
                                    message: 'Unverified account... please check your mail for verification link'
                                })
                            }
                            req.session.userId = user._id;
                            req.session.save()
                            next();
                          });
                    }
                  }) 
               }
               
           }
       })
   }
   }
export const loginCb = (req,res)=>{
return res.status(200).json({success:true,message:'Logged in as ' + req.user.username})
}
// Logout User
// @route GET /auth/logout
export const logoutUser = (req,res)=>{
                req.session.userId = undefined;
                req.session.destroy();
                req.logout();
                return res.status(200).redirect('auth/login')
            }

// EMAIL VERIFICATION
// @route GET /auth/verify/:token
export const verifyToken = (req, res) => {
    if (!req.params.token) {
        return res.status(404).json({ message: "We were unable to find a user for this token." });
    }
    // Find a matching token
    Token.findOne({ token: req.params.token }, (err, token) => {
        if (!token) {
            return res.status(404).json({ message: 'We were unable to find a valid token. Your token my have expired.' });
        }
        if (token) {
            User.findOne({ _id: token.userId }, (err, user) => {
                if (!user) {
                    return res.status(404).json({ message: 'We were unable to find a user for this token.' });
                }
                if (user.isVerified) {
                    return res.status(403).json({ message: 'This user has already been verified.' });
                }
                // Verify and save the user
                user.isVerified = true;
                user.save(function (err) {
                    if (err) {
                        return res.status(500).json({ message: err.message });
                    }

                    res.status(200).send("The account has been verified. Please log in.");
                });
            });
        }
    });
}

export const verifyAdminRegistrationToken = (req, res) => {
    if (!req.params.token) {
        return res.status(400).json({ message: "We were unable to find a user for this token." });
    }
    // Find a matching token
    Token.findOne({ token: req.params.token }, (err, token) => {
        if (!token) {
            return res.status(404).json({ message: 'We were unable to find a valid token. Your token my have expired.' });
        }
        if (token) {
            User.findOne({ _id: token.userId }, (err, user) => {
                if (!user) {
                    return res.status(404).json({ message: 'We were unable to find a user for this token.' });
                }
                if (user.isVerified) {
                    return res.status(403).json({ message: 'This user has already been verified.' });
                }
                // Verify and save the user
                user.isVerified = true;
                user.save(function (err) {
                    if (err) {
                        return res.status(500).json({ message: err.message });
                    }
                    res.status(200).send("The account has been verified. Please log in.");
                    //Redirect to the user's update profile page must be done here
                });
            });
        }
    });
}

// Resend Verification Token
// @route POST user/verify/resend
export const resendToken = (req, res) => {
    const { email } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err) {
            return res.status(500).json({ message: "error", error: err.message })
        }
        if (!user) {
            return res.status(401).json({ message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.' });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: 'This account has already been verified. Please log in.' });
        }
        sendTokenMail(user, req, res);
    });
} 
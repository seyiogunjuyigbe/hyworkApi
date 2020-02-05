import {User} from '../models/User';
import{Token} from '../models/Token'
const mongoose = require('mongoose');
const passport = require('passport');
import {sendTokenMail} from '../middlewares/mail';
const LocalStrategy = require('passport-local');
// import {passportConfig} from '../config/passport';
// passportConfig();

// Register new User
// @route POST /user/register
export const registerNewUser = (req, res) => {
    const { email,username } = req.body;
    
    User.findOne({ email }, (err,user)=>{
        if(err){
            return res.status(500).json({success: false, message: err.message})
        }
     else if (user) {
        return res.status(401).json({message: 'The email address you have entered is already associated with another account'})
         } else{
            User.findOne({ username }, (err,user)=>{
          if (user){
        return res.status(401).json({message: 'This username is already taken'})
          }  
             }); 
    
        }       
    User.create({ ...req.body, role: "user" }, (err,newUser)=>{
        if(err){
           return res.status(500).json({success: false, message: err.message});
        }else{ 
            passport.authenticate("local")(req, res, function(){
                sendTokenMail(newUser,req,res)
                newUser.save();
                return res.status(200).json({
                    success: true,
                    data: newUser
                })
               })
        }
            });
        });
            } 
    
    
// Login Existing User
// @route POST /user/login
   export const loginUser =  passport.authenticate('local-login', {
                                        successRedirect: '/user/login/success', 
                                        failureRedirect: '/user/login/failure'}) 

// Logout User
// @route GET /user/logout
        export const logoutUser = (req,res)=>{
                req.session.destroy();
                req.logout();
                return res.status(200).json({
                message: 'logged out successfully',
                user: req.user
            })
                    }

// EMAIL VERIFICATION
// @route GET /user/verify/:token
export const verifyToken = (req, res) => {
    if(!req.params.token){
      return res.status(400).json({message: "We were unable to find a user for this token."});  
    } 
        // Find a matching token
        Token.findOne({ token: req.params.token }, (err, token)=>{
            if (!token) {
            return res.status(400).json({ message: 'We were unable to find a valid token. Your token my have expired.' });
               }
            if(token){
                User.findOne({ _id: token.userId }, (err, user) => {
                    if (!user){
                        return res.status(400).json({ message: 'We were unable to find a user for this token.' });
                            }
                    if (user.isVerified) {
                        return res.status(400).json({ message: 'This user has already been verified.' });
                            }
                         // Verify and save the user
                     user.isVerified = true;
                     user.save(function (err) {
                         if (err) {
                            return res.status(500).json({message:err.message});
                            }
                            
                           res.status(200).send("The account has been verified. Please log in.");
                         });
                       });
                       }
            });      
    } 

// Resend Verification Token
// @route POST user/verify/resend
export const resendToken = (req, res) => {
        const { email } = req.body;
        User.findOne({ email }, (err,user)=>{
            if(err){
                return res.status(500).json({message: "error", error: err.message})
            }
            if (!user){
                 return res.status(401).json({ message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});
                    }
            if (user.isVerified){
                 return res.status(400).json({ message: 'This account has already been verified. Please log in.'});
                }
            sendTokenMail(user, req, res);
        });
    } 

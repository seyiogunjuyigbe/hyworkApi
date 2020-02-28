import { MAIL_SENDER, MAIL_PASS, MAIL_SERVICE, MAIL_USER } from '../config/constants';
import {User} from '../models/User';
const nodemailer = require('nodemailer');
const {validationResult} = require('express-validator');
const transporter = nodemailer.createTransport({
    service: MAIL_SERVICE,
    auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
        },
    });  


// @route GET /auth/password/recover
// Render page for password recovery
export const recoverPass = (req,res)=>{
    return res.status(200).render('recoverPassword', {message: null})
}


// @route POST /auth/password/recover
// Recover Password - Generates token and Sends password reset email
export const recover = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    let error = []; errors.array().map((err) => error.push(err.msg));
    return res.status(422).render('recoverPassword',{message: error});
    } else{ 
         const { email } = req.body;
            User.findOne({ email }, (err,user)=>{
                if (!user){ 
                    return res.status(401).render('recoverPassword',{ message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});
                        }
            //Generate and set password reset token
            user.generatePasswordReset();
            // Save the updated user object
            user.save((err,user)=>{
            if(err){
                res.status(500).render('error/500',{success:false, error: err.message})
            } else{
                    let link = "http://" + req.headers.host + "/auth/password/reset/" + user.resetPasswordToken;
                    const mailOptions = {
                        to: user.email,
                        from: MAIL_SENDER,
                        subject: "Password change request",
                        text: `Hi ${user.username} \n 
                        Please click on the following link ${link} to reset your password. \n\n 
                        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            res.status(500).render('error/500');
                            console.log(error);
                        } else {
                        res.status(200).render('recoverMailSent',{message: 'A password recovery link has been sent to ' + user.email + '.',link});
                        }
                    });  
            }
        })     
            })
        };
    }

// @route POST /auth/password/reset
// Reset Password - Validate password reset token and shows the password reset view

export const reset = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    let error = []; errors.array().map((err) => error.push(err.msg));
    return res.status(422).render('recoverPassword',{message:error});
    } else{ 
         const { token } = req.params;
         User.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}}, (err,user)=>{
            if (!user) {  
            return res.status(401).render('recoverPassword',{message: 'Password reset token is invalid or has expired.'});
                }
            else{
                 //Redirect user to form with the email address
                 res.render('reset', {user: user, message: null});       
            }
         });
 } } ;


// @route POST /auth/password/reset
// Reset Password
export const resetPassword = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    let error = []; errors.array().map((err) => error.push(err.msg));
    return res.status(422).render('reset',{message:error});
    } else{ 
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, (err,user)=>{
        if (!user) {
    return res.status(401).render('reset',{message:'Password reset token is invalid or has expired.'});
                    }
        else{
            //Set the new password
            user.setPassword(req.body.password, (err,user)=>{
                if(err){return res.status(500).render('500')}
              user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            user.isVerified = true;  
            user.save((err) => {
                if (err) {return res.status(500).render('500');
              
            } else{
              // send email 
              const mailOptions = {
                to: user.email,
                from: MAIL_SENDER,
                subject: "Your password has been changed",
                text: `Hi ${user.username} \n 
                This is a confirmation that the password for your account ${user.email} has just been changed.\n`
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                    res.status(200).render('resetSuccess');
                }
            });
          }
          })  
            })     
            };
        });
        };
    }   

        // Change Password
        // @POST
        export const changePassword = (req,res)=>{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            let error = []; errors.array().map((err) => error.push(err.msg));
            return res.status(422).render('reset',{message:error});
            } else{ 
            User.findById(req.user._id, (err,user)=>{
                if(err){return res.status(500).render('500')}
                else if(!user){return res.status(403).render('reset',{message: 'User not found'})}
                else if(user){
                    user.changePassword(user.password,req.body.password, (err, user)=>{
                        if(err){return res.status(500).render('500')}
                        user.save((err,user)=>{if(!err)res.status(200).render('resetSuccess')})
                    })
                }
            })
        }}
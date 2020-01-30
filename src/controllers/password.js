import { MAIL_SENDER, MAIL_PASS, MAIL_SERVICE, MAIL_USER } from '../config/constants';
import User from '../models/User';
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: MAIL_SERVICE,
    auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
        },
    });  

// @route POST user/auth/recover
// Recover Password - Generates token and Sends password reset email
export const recover = (req, res) => {
         const { email } = req.body;
            User.findOne({ email }, (err,user)=>{
                if (!user){ 
                    return res.status(401).json({ message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});
                        }
            //Generate and set password reset token
            user.generatePasswordReset();
            // Save the updated user object
            user.save((err,user)=>{
            if(err){
                return res.status(500).json({success:false, error: err.message})
            } else{
                    let link = "http://" + req.headers.host + "/password/reset/" + user.resetPasswordToken;
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
                        console.log(error);
                        } else {
                        res.status(200).json({message: 'A password recovery link has been sent to ' + user.email + '.'});
                        }
                    });  
            }
        })     
            })
        };

// @route POST user/auth/reset
// Reset Password - Validate password reset token and shows the password reset view

export const reset = (req, res) => {
         const { token } = req.params;
         User.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}}, (err,user)=>{
            if (!user) {  
            return res.status(401).json({message: 'Password reset token is invalid or has expired.'});
                }
            else{
                 //Redirect user to form with the email address
                 res.render('reset', {user: user});       
            }
         });
    } ;


// @route POST user/auth/reset
// Reset Password
export const resetPassword = (req, res) => {
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, (err,user)=>{
        if (!user) {
            return res.status(401).json({message: 'Password reset token is invalid or has expired.'});
                    }
        else{
            //Set the new password
            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            user.isVerified = true;
            // Save
            user.save((err) => {
                if (err) {return res.status(500).json({message: err.message});
              
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
                    res.status(200).json({message: 'Your password has been updated.'});
                }
            });  
            }
          })            
            };
        });
        };
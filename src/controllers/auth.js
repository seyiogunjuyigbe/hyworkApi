import {User} from '../models/User';
import{Token} from '../models/Token'
const passport = require('passport');
import {sendTokenMail} from '../middlewares/mail';
import {passportConfig} from '../config/passport';
passportConfig(passport);
const passportLocalMongoose = require('passport-local-mongoose')

// Register new Admin
// @route POST /auth/register
export const registerNewUser = (req, res) => {       
            let newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                role: 'admin'
            });
            newUser.username = req.body.username;
            User.register(newUser, req.body.password, function(err,user){
              if(err){
                  return res.status(500).json({success:false, message: err.message});
              }
              else{
                passport.authenticate("local")(req, res, function(){
                    sendTokenMail(newUser,req,res);
                    newUser.save();
                   })
    }
     })
    }

    
// Login Existing User
// @route POST /auth/login
//    export const loginUser = passport.authenticate('local-login')
   export const loginUser = (req,res, next)=>{
       User.findOne({email: req.body.email}, (err,user)=>{
           if(err){return res.status(500).json({message: err.message})}
           else if(!user){return res.status(403).json({message: 'No user found with this email address'})}
           else {
               if(req.body.password){
                  user.authenticate(req.body.password, (err,found,passwordErr)=>{
                    if(err){
                        return res.status(500).json({message: err.message})
                    } else if(passwordErr){
                        return res.status(403).json({message: 'Incorrect password'})
                    } else if(found){
                        req.login(user, function(err) {
                            if(err){return res.status(500).json({message: err.message})}
                            else if (!user.isVerified){
                                return res.status(200).json({
                                    success: true,
                                    message: 'Unverified account... please check your mail for verification link'
                                })
                            }
                            next();
                          });
                    }
                  }) 
               }
               
           }
       })
   }

export const loginCb = (req,res)=>{
  return res.status(200).json({
      status: 'logged in',
      message: 'Successfully logged in',
      user: req.user.username
  })
}
// Logout User
// @route GET /auth/logout
export const logoutUser = (req,res)=>{
                req.session.destroy();
                req.logout();
                return res.status(200).json({
                message: 'logged out successfully',
                user: req.user
            })
                    }

// EMAIL VERIFICATION
// @route GET /auth/verify/:token
export const verifyToken = (req, res) => {
    if (!req.params.token) {
        return res.status(400).json({ message: "We were unable to find a user for this token." });
    }
    // Find a matching token
    Token.findOne({ token: req.params.token }, (err, token) => {
        if (!token) {
            return res.status(400).json({ message: 'We were unable to find a valid token. Your token my have expired.' });
        }
        if (token) {
            User.findOne({ _id: token.userId }, (err, user) => {
                if (!user) {
                    return res.status(400).json({ message: 'We were unable to find a user for this token.' });
                }
                if (user.isVerified) {
                    return res.status(400).json({ message: 'This user has already been verified.' });
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
            return res.status(400).json({ message: 'We were unable to find a valid token. Your token my have expired.' });
        }
        if (token) {
            User.findOne({ _id: token.userId }, (err, user) => {
                if (!user) {
                    return res.status(400).json({ message: 'We were unable to find a user for this token.' });
                }
                if (user.isVerified) {
                    return res.status(400).json({ message: 'This user has already been verified.' });
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

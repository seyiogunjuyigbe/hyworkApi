import {Token} from '../models/Token';
const nodemailer = require('nodemailer');
import {MAIL_SERVICE, MAIL_SENDER, MAIL_PASS, MAIL_USER} from '../config/constants'

export const sendCreateOrganisationEmail = (user, organisation, req, res) => {
  let transporter = nodemailer.createTransport({
    service: MAIL_SERVICE,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS
    }
  });
  let mailOptions = {
    from: MAIL_SENDER,
    to: user.email,
    subject: `Created Organization ${organisation.name}`,
    text: `Hello ${user.username} \n 
                You just created the new organisation. You can login to your dashboard and start enjoying the best features of the zpclone app now \n\n 
                Welcome\n`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      res.status(200).json({
        message: "A welcome email has been sent to " + user.email + "."
      });
    }
  });
};

export const senduserEmail = (user, organisation, req, res) => {
  const token = user.generateVerificationToken();
  token.save(function(err, token) {
    if (err) {
      return res.status(500).json({ message: err.message })
    }else {
      let link = `http://${req.headers.host}/organization/${organisation.urlname}/user/${token.token}`
      let transporter = nodemailer.createTransport({
        service: MAIL_SERVICE,
        auth: {
          user: MAIL_USER,
          pass: MAIL_PASS
        }
      });
      let mailOptions = {
        from: MAIL_SENDER,
        to: user.email,
        subject: `Joined ${organisation.name}`,
        text: `Hello ${user.firstName} \n 
                    You have been added to ${organisation.name}'s workspace. Click on this ${link} to complete your registation\n`
      };
    
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          res.status(200).json({
            message: "A welcome email has been sent to " + user.email + "."
          });
        }
      });
    }
  })
  
};

export const sendTokenMail = (user, req, res) => {
  const token = user.generateVerificationToken();
  token.save(function(err, token) {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      let link = `http://${req.headers.host}/user/verify/${token.token}`;
      let transporter = nodemailer.createTransport({
        service: MAIL_SERVICE,
        auth: {
          user: MAIL_USER,
          pass: MAIL_PASS
        }
      });
      let mailOptions = {
        from: MAIL_SENDER,
        to: user.email,
        subject: "Verify your email",
        text: `Hi ${user.username} \n 
                Please click on the following link ${link} to verify your account. \n\n 
                If you did not request this, please ignore this email.\n`,
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    return res.status(500).json({success: false, error: error});
                } else {
                    console.log('mail sent to ' + user.email)
                    return res.status(200).json({message: 'Successfully registered! A verification email has been sent to ' + user.email + '.'});
                }
            });                
    }
  });
};
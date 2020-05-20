import { Token } from '../models/Token';
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
import { MAIL_SERVICE, MAIL_SENDER, MAIL_PASS, MAIL_USER, SENDGRID_USERNAME, SENDGRID_PASSWORD } from '../config/constants'
import nanoid from 'nanoid';
const response = require('./response');


const options = {
  auth: {
    api_user: SENDGRID_USERNAME,
    api_key: SENDGRID_PASSWORD
  }
};

const transporter = nodemailer.createTransport(sgTransport(options));

export const sendCreateOrganisationEmail = (user, organisation, req, res) => {

  let mailOptions = {
    from: MAIL_SENDER,
    to: user.email,
    subject: `Created Organization ${organisation.name}`,
    text: `Hello ${user.username} \n 
                You just created the new organisation. You can login to your dashboard and start enjoying the best features of the zpclone app now \n\n 
                Welcome\n`
  };

  transporter.sendMail(mailOptions, function (error, info) {
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
  const { Token } = req.dbModels;
  Token.create({
    userId: user._id,
    token: nanoid(10)
  }, (err, token) => {
    if (err) return response.error(res, 500, err.message)
    else {
      token.save();
      let link = `http://${req.headers.host}/org/${organisation.urlname}/user/${token.token}`;

      let mailOptions = {
        from: MAIL_SENDER,
        to: user.email,
        subject: `Joined ${organisation.name}`,
        text: `Hello ${user.firstName} \n 
               You have been added to ${organisation.name}'s workspace. Click on this ${link} to complete your registation\n`
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          response.success(res, 200, "A welcome email has been sent to " + user.email + ".");
        }
      })

    }
  })
}

export const sendTokenMail = (user, req, res) => {
  const token = user.generateVerificationToken();
  token.save(function (err, token) {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      let link = `http://${req.headers.host}/auth/verify/${token.token}`;

      let mailOptions = {
        from: MAIL_SENDER,
        to: user.email,
        subject: "Verify your email",
        text: `Hi ${user.username} \n 
                Please click on the following link ${link} to verify your account. \n\n 
                If you did not request this, please ignore this email.\n`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return res.status(500).render('error/500', { message: error });
        } else {
          console.log('mail sent to ' + user.email)
          return res.status(200).render('tokenSent', {
            message: 'Successfully registered! A verification email has been sent to ' + user.email + '.',
            baseUrl: `http://${req.headers.host}`,
            link,
            email: user.email
          });
        }
      });
    }
  });
};


export const sendMailToTheseUsers = (req, res, mailOptions, next) => {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.status(500).render('error/500', { message: error });
    } else {
      return next()
    }
  });
}

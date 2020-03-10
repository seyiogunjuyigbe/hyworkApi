"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changePassword = exports.resetPassword = exports.reset = exports.recover = exports.recoverPass = void 0;

var _constants = require("../config/constants");

var _User = require("../models/User");

var nodemailer = require('nodemailer');

var _require = require('express-validator'),
    validationResult = _require.validationResult;

var transporter = nodemailer.createTransport({
  service: _constants.MAIL_SERVICE,
  auth: {
    user: _constants.MAIL_USER,
    pass: _constants.MAIL_PASS
  }
}); // @route GET /auth/password/recover
// Render page for password recovery

var recoverPass = function recoverPass(req, res) {
  return res.status(200).render('recoverPassword', {
    message: null
  });
}; // @route POST /auth/password/recover
// Recover Password - Generates token and Sends password reset email


exports.recoverPass = recoverPass;

var recover = function recover(req, res) {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    var error = [];
    errors.array().map(function (err) {
      return error.push(err.msg);
    });
    return res.status(422).render('recoverPassword', {
      message: error
    });
  } else {
    var email = req.body.email;

    _User.User.findOne({
      email: email
    }, function (err, user) {
      if (!user) {
        return res.status(401).render('recoverPassword', {
          message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'
        });
      } //Generate and set password reset token


      user.generatePasswordReset(); // Save the updated user object

      user.save(function (err, user) {
        if (err) {
          res.status(500).render('error/500', {
            success: false,
            error: err.message
          });
        } else {
          var link = "http://" + req.headers.host + "/auth/password/reset/" + user.resetPasswordToken;
          var mailOptions = {
            to: user.email,
            from: _constants.MAIL_SENDER,
            subject: "Password change request",
            text: "Hi ".concat(user.username, " \n \n                        Please click on the following link ").concat(link, " to reset your password. \n\n \n                        If you did not request this, please ignore this email and your password will remain unchanged.\n")
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
              res.status(500).render('error/500', {
                message: 'Connection error'
              }); // return res.status(200).json({link})
            } else {
              //    return res.status(200).json({link})
              res.status(200).render('recoverMailSent', {
                message: 'A password recovery link has been sent to ' + user.email + '.',
                link: link
              });
            }
          });
        }
      });
    });
  }

  ;
}; // @route POST /auth/password/reset
// Reset Password - Validate password reset token and shows the password reset view


exports.recover = recover;

var reset = function reset(req, res) {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    var error = [];
    errors.array().map(function (err) {
      return error.push(err.msg);
    });
    return res.status(422).render('recoverPassword', {
      message: error
    });
  } else {
    var token = req.params.token;

    _User.User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {
        $gt: Date.now()
      }
    }, function (err, user) {
      if (!user) {
        return res.status(401).render('recoverPassword', {
          message: 'Password reset token is invalid or has expired.'
        });
      } else {
        //Redirect user to form with the email address
        res.render('reset', {
          user: user,
          message: null
        });
      }
    });
  }
}; // @route POST /auth/password/reset
// Reset Password


exports.reset = reset;

var resetPassword = function resetPassword(req, res) {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    var error = [];
    errors.array().map(function (err) {
      return error.push(err.msg);
    });
    return res.status(422).render('reset', {
      message: error
    });
  } else {
    _User.User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: {
        $gt: Date.now()
      }
    }, function (err, user) {
      if (!user) {
        return res.status(401).render('reset', {
          message: 'Password reset token is invalid or has expired.'
        });
      } else {
        //Set the new password
        user.setPassword(req.body.password, function (err, user) {
          if (err) {
            return res.status(500).render('500');
          }

          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          user.isVerified = true;
          user.save(function (err) {
            if (err) {
              return res.status(500).render('500');
            } else {
              // send email 
              var mailOptions = {
                to: user.email,
                from: _constants.MAIL_SENDER,
                subject: "Your password has been changed",
                text: "Hi ".concat(user.username, " \n \n                This is a confirmation that the password for your account ").concat(user.email, " has just been changed.\n")
              };
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  res.status(200).render('resetSuccess');
                }
              });
            }
          });
        });
      }

      ;
    });
  }

  ;
}; // Change Password
// @POST


exports.resetPassword = resetPassword;

var changePassword = function changePassword(req, res) {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    var error = [];
    errors.array().map(function (err) {
      return error.push(err.msg);
    });
    return res.status(422).render('reset', {
      message: error
    });
  } else {
    _User.User.findById(req.user._id, function (err, user) {
      if (err) {
        return res.status(500).render('500');
      } else if (!user) {
        return res.status(403).render('reset', {
          message: 'User not found'
        });
      } else if (user) {
        user.changePassword(user.password, req.body.password, function (err, user) {
          if (err) {
            return res.status(500).render('500');
          }

          user.save(function (err, user) {
            if (!err) res.status(200).render('resetSuccess');
          });
        });
      }
    });
  }
};

exports.changePassword = changePassword;
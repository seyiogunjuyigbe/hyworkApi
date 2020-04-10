"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resendToken = exports.verifyAdminRegistrationToken = exports.verifyToken = exports.logoutUser = exports.loginCb = exports.loginUser = exports.renderLoginPage = exports.registerNewUser = exports.renderSignUpPage = undefined;

var _User = require("../models/User");

var _Token = require("../models/Token");

var _mail = require("../middlewares/mail");

var _passport = require("../config/passport");

var _Organization = require("../models/Organization");

var passport = require('passport');

(0, _passport.passportConfig)(passport, _User.User);

var _require = require('express-validator'),
    validationResult = _require.validationResult; // Render Register Page
// @route GET /auth/register


var renderSignUpPage = exports.renderSignUpPage = function renderSignUpPage(req, res) {
  return res.status(200).render('register', {
    err: null
  });
}; // Register new Admin
// @route POST /auth/register.


var registerNewUser = exports.registerNewUser = function registerNewUser(req, res) {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    var error = [];
    errors.array().map(function (err) {
      return error.push(err.msg);
    });
    return res.status(422).render('register', {
      err: error
    });
  } else {
    _User.User.findOne({
      email: req.body.email
    }).then(function (user) {
      if (user) return res.status(403).render('register', {
        err: 'A user with this email already exists'
      });
    })["catch"](function (error) {
      return res.status(500).render('500');
    });

    _User.User.findOne({
      username: req.body.username
    }).then(function (user) {
      if (user) return res.status(403).render('register', {
        err: 'This username is already taken'
      });else {
        var newUser = new _User.User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          role: 'admin'
        });
        newUser.username = req.body.username;

        _User.User.register(newUser, req.body.password, function (err, user) {
          if (err) {
            console.log(err);
            return res.status(500).render('register', {
              success: false,
              err: err.message
            });
          } else {
            passport.authenticate("local")(req, res, function () {
              (0, _mail.sendTokenMail)(newUser, req, res);
              newUser.save();
            });
          }
        });
      }
    })["catch"](function (error) {
      return res.status(500).render('500');
    });
  }
}; // Render Login Page
// @ROUTE GET /auth/login


var renderLoginPage = exports.renderLoginPage = function renderLoginPage(req, res) {
  if (!req.user) return res.status(200).render('login', {
    url: "http://" + req.headers.host,
    err: null
  });else res.send('Hey, ' + req.user.username + ', You are already logged in');
}; // Login Existing User
// @route POST /auth/login
// export const loginUser = passport.authenticate('local-login')


var loginUser = exports.loginUser = function loginUser(req, res, next) {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    var error = [];
    errors.array().map(function (err) {
      return error.push(err.msg);
    });
    return res.status(422).render('login', {
      err: error
    });
  } else {
    _User.User.findOne({
      email: req.body.email
    }, function (err, user) {
      if (err) {
        return res.status(500).render('error/500');
      } else if (!user) {
        return res.status(403).render('login', {
          err: 'No user found with this email address'
        });
      } else {
        if (req.body.password) {
          user.authenticate(req.body.password, function (err, found, passwordErr) {
            if (err) {
              return res.status(500).render('error/500', {
                message: err.message
              });
            } else if (passwordErr) {
              return res.status(403).render('login', {
                err: 'Incorrect password'
              });
            } else if (found) {
              req.login(user, function (err) {
                if (err) {
                  return res.status(500).render('error/500', {
                    message: err.message
                  });
                } else if (!user.isVerified) {
                  return res.status(200).json({
                    success: true,
                    message: 'Unverified account... please check your mail for verification link'
                  });
                }

                req.session.userId = user._id;
                req.session.save();
                next();
              });
            }
          });
        }
      }
    });
  }
};

var loginCb = exports.loginCb = function loginCb(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Logged in as ' + req.user.username
  });
}; // Logout User
// @route GET /auth/logout


var logoutUser = exports.logoutUser = function logoutUser(req, res) {
  req.session.userId = undefined;
  req.session.destroy();
  req.logout();
  return res.status(200).redirect('auth/login');
}; // EMAIL VERIFICATION
// @route GET /auth/verify/:token


var verifyToken = exports.verifyToken = function verifyToken(req, res) {
  if (!req.params.token) {
    return res.status(404).json({
      message: "We were unable to find a user for this token."
    });
  } // Find a matching token


  _Token.Token.findOne({
    token: req.params.token
  }, function (err, token) {
    if (!token) {
      return res.status(404).json({
        message: 'We were unable to find a valid token. Your token my have expired.'
      });
    }

    if (token) {
      _User.User.findOne({
        _id: token.userId
      }, function (err, user) {
        if (!user) {
          return res.status(404).json({
            message: 'We were unable to find a user for this token.'
          });
        }

        if (user.isVerified) {
          return res.status(403).json({
            message: 'This user has already been verified.'
          });
        } // Verify and save the user


        user.isVerified = true;
        user.save(function (err) {
          if (err) {
            return res.status(500).json({
              message: err.message
            });
          }

          res.status(200).send("The account has been verified. Please log in.");
        });
      });
    }
  });
};

var verifyAdminRegistrationToken = exports.verifyAdminRegistrationToken = function verifyAdminRegistrationToken(req, res) {
  if (!req.params.token) {
    return res.status(400).json({
      message: "We were unable to find a user for this token."
    });
  } // Find a matching token


  _Token.Token.findOne({
    token: req.params.token
  }, function (err, token) {
    if (!token) {
      return res.status(404).json({
        message: 'We were unable to find a valid token. Your token my have expired.'
      });
    }

    if (token) {
      _User.User.findOne({
        _id: token.userId
      }, function (err, user) {
        if (!user) {
          return res.status(404).json({
            message: 'We were unable to find a user for this token.'
          });
        }

        if (user.isVerified) {
          return res.status(403).json({
            message: 'This user has already been verified.'
          });
        } // Verify and save the user


        user.isVerified = true;
        user.save(function (err) {
          if (err) {
            return res.status(500).json({
              message: err.message
            });
          }

          res.status(200).send("The account has been verified. Please log in."); //Redirect to the user's update profile page must be done here
        });
      });
    }
  });
}; // Resend Verification Token
// @route POST user/verify/resend


var resendToken = exports.resendToken = function resendToken(req, res) {
  var email = req.body.email;

  _User.User.findOne({
    email: email
  }, function (err, user) {
    if (err) {
      return res.status(500).json({
        message: "error",
        error: err.message
      });
    }

    if (!user) {
      return res.status(401).json({
        message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: 'This account has already been verified. Please log in.'
      });
    }

    (0, _mail.sendTokenMail)(user, req, res);
  });
};
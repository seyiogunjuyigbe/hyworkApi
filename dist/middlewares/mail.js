"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendMailToTheseUsers = exports.sendTokenMail = exports.senduserEmail = exports.sendCreateOrganisationEmail = void 0;

var _Token = require("../models/Token");

var _constants = require("../config/constants");

var _nanoid = _interopRequireDefault(require("nanoid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var nodemailer = require('nodemailer');

var response = require('./response');

var sendCreateOrganisationEmail = function sendCreateOrganisationEmail(user, organisation, req, res) {
  var transporter = nodemailer.createTransport({
    service: _constants.MAIL_SERVICE,
    auth: {
      user: _constants.MAIL_USER,
      pass: _constants.MAIL_PASS
    }
  });
  var mailOptions = {
    from: _constants.MAIL_SENDER,
    to: user.email,
    subject: "Created Organization ".concat(organisation.name),
    text: "Hello ".concat(user.username, " \n \n                You just created the new organisation. You can login to your dashboard and start enjoying the best features of the zpclone app now \n\n \n                Welcome\n")
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

exports.sendCreateOrganisationEmail = sendCreateOrganisationEmail;

var senduserEmail = function senduserEmail(user, organisation, req, res) {
  var Token = req.dbModels.Token;
  Token.create({
    userId: user._id,
    token: (0, _nanoid["default"])(10)
  }, function (err, token) {
    if (err) return response.error(res, 500, err.message);else {
      token.save();
      var link = "http://".concat(req.headers.host, "/org/").concat(organisation.urlname, "/user/").concat(token.token);
      var transporter = nodemailer.createTransport({
        service: _constants.MAIL_SERVICE,
        auth: {
          user: _constants.MAIL_USER,
          pass: _constants.MAIL_PASS
        }
      });
      var mailOptions = {
        from: _constants.MAIL_SENDER,
        to: user.email,
        subject: "Joined ".concat(organisation.name),
        text: "Hello ".concat(user.firstName, " \n \n               You have been added to ").concat(organisation.name, "'s workspace. Click on this ").concat(link, " to complete your registation\n")
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          response.success(res, 200, "A welcome email has been sent to " + user.email + ".");
        }
      });
    }
  });
};

exports.senduserEmail = senduserEmail;

var sendTokenMail = function sendTokenMail(user, req, res) {
  var token = user.generateVerificationToken();
  token.save(function (err, token) {
    if (err) {
      return res.status(500).json({
        message: err.message
      });
    } else {
      var link = "http://".concat(req.headers.host, "/auth/verify/").concat(token.token);
      var transporter = nodemailer.createTransport({
        service: _constants.MAIL_SERVICE,
        auth: {
          user: _constants.MAIL_USER,
          pass: _constants.MAIL_PASS
        }
      });
      var mailOptions = {
        from: _constants.MAIL_SENDER,
        to: user.email,
        subject: "Verify your email",
        text: "Hi ".concat(user.username, " \n \n                Please click on the following link ").concat(link, " to verify your account. \n\n \n                If you did not request this, please ignore this email.\n")
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return res.status(500).render('error/500', {
            message: error
          });
        } else {
          console.log('mail sent to ' + user.email);
          return res.status(200).render('tokenSent', {
            message: 'Successfully registered! A verification email has been sent to ' + user.email + '.',
            baseUrl: "http://".concat(req.headers.host),
            link: link,
            email: user.email
          });
        }
      });
    }
  });
};

exports.sendTokenMail = sendTokenMail;

var sendMailToTheseUsers = function sendMailToTheseUsers(req, res, mailOptions, next) {
  var transporter = nodemailer.createTransport({
    service: _constants.MAIL_SERVICE,
    auth: {
      user: _constants.MAIL_USER,
      pass: _constants.MAIL_PASS
    }
  });
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.status(500).render('error/500', {
        message: error
      });
    } else {
      return next();
    }
  });
};

exports.sendMailToTheseUsers = sendMailToTheseUsers;
"use strict";

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require("chai-http");

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require("../app");

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var expect = _chai2["default"].expect;

_chai2["default"].use(_chaiHttp2["default"]);

var signinUrl = '/user/login';
var signupUrl = '/user/register';
var regularUser = {
  name: 'Regualar E. User',
  username: 'on_a_regs_ting',
  email: 'regular@regular.com',
  password: 'password1234'
};
describe('AUTH CONTROLLER', function () {
  describe('POST SIGN IN', function () {
    it('it should login a user with valid email and password', function (done) {
      _chai2["default"].request(_app2["default"]).post(signinUrl).send({
        email: 'johnDoe@mail.com',
        // valid login details
        password: '123456'
      }).end(function (error, res) {
        expect(res).to.have.status(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.payload).to.have.property('userId');
        expect(res.body.payload).to.have.property('email');
        done();
      });
    });
    it('it should return 400 error if creden', function (done) {
      _chai2["default"].request(_app2["default"]).post(signinUrl).send({
        email: 'bad email format',
        password: 1234
      }).end(function (error, res) {
        expect(res).to.have.status(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Bad Input');
        done();
      });
    });
    it('it should return 401 error if login credentials are incorrect', function (done) {
      _chai2["default"].request(_app2["default"]).post(signinUrl).send({
        email: 'wrong@email.com',
        password: '1234'
      }).end(function (error, res) {
        expect(res).to.have.status(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Incorrect email or password');
        done();
      });
    });
  });
  describe('POST REGULAR USER SIGN UP', function () {
    it('should create a new user using username, name, email and password', function (done) {
      _chai2["default"].request(_app2["default"]).post(signupUrl).send({
        name: 'Regualar E. User',
        username: 'on_a_regs_ting',
        email: 'regular@regular.com',
        password: 'password1234'
      }).end(function (error, res) {
        expect(res).to.have.status(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.payload).to.have.property('userId');
        expect(res.body.payload).to.have.property('email');
        expect(res.body.payload).to.have.property('isAdmin');
        expect(res.body.payload).to.have.property('isBlocked');
        expect(res.body.payload).to.have.property('username');
        expect(res.body.payload).to.have.property('name');
        expect(res.body.payload).to.have.property('updatedAt');
        expect(res.body.payload).to.have.property('createdAt');
        expect(res.body.payload).to.not.have.property('password');
        done();
      });
    });
    it('should respond with 400 error from missing parameter', function (done) {
      _chai2["default"].request(_app2["default"]).post(signupUrl).send({
        name: 'Bad User',
        email: 'email@email.com',
        password: '1234%'
      }).end(function (error, res) {
        expect(res).to.have.status(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Bad Sign up Input');
        done();
      });
    });
    it('should respond with validation errors for bad inputs', function (done) {
      _chai2["default"].request(_app2["default"]).post(signupUrl).send({
        name: 'Bad User',
        username: 'bad_username',
        email: 'bad email :-p',
        password: 1234
      }).end(function (error, res) {
        expect(res).to.have.status(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.payload).to.have.members(['password must be a string', 'email must be a valid email']);
        expect(res.body.message).to.equal('Bad Sign up Input');
        done();
      });
    });
    it('should respond with 409 error if user is a duplicate', function (done) {
      _chai2["default"].request(_app2["default"]).post(signupUrl).send(regularUser).end(function (error, res) {
        _chai2["default"].request(_app2["default"]).post(signupUrl).send(regularUser).end(function (e, res) {
          expect(res).to.have.status(409);
          expect(res.body.success).to.be.equal(false);
          expect(res.body.message).to.be.equal('User with this email already exists');
          done();
        });
      });
    });
  });
});
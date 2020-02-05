const jwt = require("jsonwebtoken");
const response = require("./response");
const UserModel = require("../models/User");
const passport = require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJWT;
import { SECRET_KEY } from '../config/constants';

/*  Function checks that user is authenticated 
*/
// passport.use(new JWTStrategy({
//   jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//   secretOrKey: SECRET_KEY
//   },
//   function(jwtPayload, cb) {
//     return UserModel.findOneById(jwtPayload.id)
//           .then(user => {
//               return cb(null, user);
//           })
//           .catch(err => {
//               return cb(err);
//           });
//         }
// ));

module.exports = {

  /*  Function fetches User details from the token, may be unnecessary with 
  Passport JWT Authentication
   */

  async isUserAdmin(req, res, next) {
    const user = req.user;
    if (user.role === "admin") {
      return true;
    } else {
      response.error(res, 400, "User was not found")
    }
  },

  /* Function that checks if User is a Manager, returns the department user is a manager 
   */
  async isUserManager(req, res, next) {
    const user = req.user;

    if (user.role === "manager") {
      console.log(user.department)
      return user.department;
    }

  },

  async checkUserRole(req, res, next) {
    const user = req.user;
    return user.role
    next()
  }

};

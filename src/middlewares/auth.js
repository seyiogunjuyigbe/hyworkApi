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
  async getUserFromToken(req, res) {
    const { token } = req.headers;
    if (!token) {
      return response.error(res, 401, "Token is required");
    }
    try {
      const decode = jwt.verify(token, SECRET_KEY);
      return (req.decode = decode);
    } catch (error) {
      return response.error(res, 401, "Error token type");
    }
  },

  async isUserAdmin(req, res, next) {
    const user = getUserFromToken(req, res);
    if (user.username) {
      try {
        const { username } = req.params;
        if (username !== user.username) {
          return response.error(res, 401, "Wrong user");
        }
        const isAdmin = UserModel.findOne({ username }).exec();
        if (isAdmin.role === "admin") {
          return next();
        }
        return response.error({ message: "User is not admin " });
      } catch (error) {
        return next({ message: "Error validating user" });
      }
    }
  },

/* Function that checks if User is a Manager, returns the department user is a manager 
 */
  async isUserManager(req, res, next) {
    const user = getUserFromToken(req, res);
    if (user.username) {
      try {
        const { username } = req.params;
        if (username !== user.username) {
          return response.error(res, 401, "Wrong user");
        }
        const isManager = UserModel.findOne({ username }).exec();
        if (isManager.role === "manager") {
          return isManager.department;
        }
        return response.error({ message: "User is not manager " });
      } catch (error) {
        return next({ message: "Error validating user" });
      }
    }
  },
};

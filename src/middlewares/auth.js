const jwt = require("jsonwebtoken");
const response = require("./response");
const UserModel = require("../models/User");
import { SECRET_KEY } from '../config/constants';

module.exports = {
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

  async authUser(req, res, next) {
    const user = await getUserFromToken(req, res);
    if (user.username) {
      try {
        const { username } = req.params;
        if (username !== user.username) {
          return response.error(res, 401, "Wrong user");
        }
        return next();
      } catch (error) {
        return next({ message: "Error validating User" });
      }
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

  async isUserManager(req, res, next) {
    const user = getUserFromToken(req, res);
    if (user.username) {
      try {
        const { username } = req.params;
        if (username !== user.username) {
          return response.error(res, 401, "Wrong user");
        }
        const isAdmin = UserModel.findOne({ username }).exec();
        if (isAdmin.role === "manager") {
          return departmen
        }
        return response.error({ message: "User is not admin " });
      } catch (error) {
        return next({ message: "Error validating user" });
      }
    }
  },
};

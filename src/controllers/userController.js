import { User } from "../models/User";
import response from "../middlewares/response";

module.exports = {
  async getUserByUsername(req, res, next) {
    try {
      const { username } = req.params;
      const user = await User.findOne({ username })
        // .lean()
        // .exec();
      if (!user) {
        response.error(
          res,
          401,
          `Couldn't fetch user with username ${username}`
        );
      }
      response.success(res, 200, user);
    }catch (error) {
      response.error(res, 500, error.message);

    }
  },
  async getAllUsers(req, res, next) {
    try {
      const users = await User.find({})
        .lean()
        .exec();
      if (!users) {
        response.error(res, 401, `Couldn't fetch users`);
      }
      response.success(res, 200, users);
    } catch (error) {
      response.error(res, 500, error.message);
    }
  }
};

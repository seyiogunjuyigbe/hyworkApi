import { Location } from "../models/Location";
import response from "../middlewares/response";

module.exports = {
  async getAllLocations(req, res, next) {
    try {
      const location = await Location.find({})
        .lean()
        .exec();
      if (!location) {
        response.error(res, 401, `Couldn't fetch location`);
      }
      response.success(res, 200, location);
    } catch (error) {
      response.error(res, 501, error.message);
    }
  },
  
};

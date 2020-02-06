import { Organization } from "../models/Organization";
import { User } from "../models/User";
const response = require("../middlewares/response");
import { crudControllers } from "../../utils/crud";
import { sendCreateOrganisationEmail, senduserEmail } from "../middlewares/mail";

module.exports = {
  // Controller that creates a new organization. The user that creates the organization is immediately added as the
  //the an admin of the newly created organisation.
  async createOrganization(req, res) {
    try {
      console.log(req.user.organizations.length);
      if (req.user.organizations.length <= 10) {
        const newOrg = await Organization.create(req.body);
        if (req.user) {
          newOrg.admin.push(req.user._id);
          newOrg.save((err) => {
            if (err) {
              return response.error(res, 500, err.message);
            }
            const user = await User.findOne({ _id: req.user._id });
            user.organizations.push(newOrg._id);
            user.save((err) => {
              if (err) {
                response.error(res, 500, err.message);
              }
              response.success(res, 200, `Organisation ${newOrg.name} created`);
            })
            sendCreateOrganisationEmail(user, newOrg, req, res);
          });

        }

      }
    } catch (error) {
      response.error(res, 500, error.message);
    }
  },

  async addUserToOrganization(req, res) {
    try {
      // const { email, firstName, lastName, role } = req.body;
      //const updateOrganization = await Organization.findByIdAndUpdate({_id: id}, { $push: { employees: emplo}}   )
      const user = await User.findOne({ email })
      if (!user) {
        const newUser = await User.create(req.body);
      }
      const updatedOrganization = await Organization.findByIdAndUpdate(
        { _id: req.params.id },
        { $push: { employees: user ? user._id : newUser._id } }
      );
      if (updatedOrganization) {
        senduserEmail(user ? user : newUser, updatedOrganization, req, res);
      }
      else {
        return response.error(res, 500, `User could not be created`);
      }
    } catch (error) {
      response.error(res, 500, error.message);
    }
  }
};

export default crudControllers(Organization);

import { Organization } from "../models/Organization";
import { User } from "../models/User";
const response = require("../middlewares/response");
import { crudControllers } from "../../utils/crud";
import { sendCreateOrganisationEmail } from "../middlewares/mail";

module.exports = {
  // Controller that creates a new organization. The user that creates the organization is immediately added as the
  //the an admin of the newly created organisation.
  async createOrganization(req, res) {
    try {
      //    const { name, description, category } = req.body;
      const newOrganization = await Organization.create({
        ...req.body,
        admin: admin.push(req.user.id)
      })
        .lean()
        .exec();
      const user = crudControllers(User).getOneById(req.user.id);
      if (newOrganization.name && user.username) {
        sendCreateOrganisationEmail(user, newOrganization, req, res);
        response.success(res, 201, `${organisation.name} has been created`);
      }
      response.error(res, 400, "Could not create organisation");
    } catch (error) {
      response.error(res, 500, error.message);
    }
  },

  async addUserToOrganization(req, res) {
    try {
      const { organisationId } = req.params;
      const { email, firstName, lastName, role } = req.body;
      //const updateOrganization = await Organization.findByIdAndUpdate({_id: id}, { $push: { employees: emplo}}   )
      const user = crudControllers(User).createOne({
        email,
        firstName,
        lastName,
        role
      });
      if (user) {
        const organisation = await Organization.findByIdAndUpdate(
          { _id: organisationId },
          { $push: { employees: user } },
          (error, success) => {
            if (error) {
              return response.error(res, 500, error.message);
            } else {
              return response.success(
                res,
                201,
                `Successfully added user with email ${email} to organization`
              );
            }
          }
        );
      } else {
        return response.error(res, 500, `User could not be created`);
      }
    } catch (error) {
      response.error(res, 500, error.message);
    }
  }
};

export default crudControllers(Organization);

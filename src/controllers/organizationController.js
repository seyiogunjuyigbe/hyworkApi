import { Organization } from "../models/Organization";
import { User } from "../models/User";
import { Token } from "../models/Token";
const response = require("../middlewares/response");
import { crudControllers } from "../../utils/crud";
import { sendCreateOrganisationEmail, senduserEmail } from "../middlewares/mail";
import { checkUrlExists } from "../middlewares/middleware";


const errors = [];

module.exports = {
  // Controller that creates a new organization. The user that creates the organization is immediately added as the
  //the an admin of the newly created organisation.
  async createOrganization(req, res) {
    try {
      if (req.user.organizations.length >= 10) { errors.push('User has registered more than 10 organizations') }
      if (checkUrlExists(req.params.urlname)) { errors.push(`Organization with the username ${req.params.username} already exists`) }
      if (errors.length === 0) {
        // console.log(req.user.organizations.length)
        const newOrg = await Organization.create(req.body);
        newOrg.admin.push(req.user._id);
        newOrg.save((err) => {
          if (err) {
            return response.error(res, 500, err.message);
          }

        });
        const user = await User.findOne({ _id: req.user._id });
        user.organizations.push(newOrg._id);
        user.save((err) => {
          if (err) {
            response.error(res, 500, err.message);
          }
          response.success(res, 200, `Organisation ${newOrg.name} created`);
        })
        sendCreateOrganisationEmail(user, newOrg, req, res);



      } else {
        response.error(res, 500, errors);
      }
    } catch (error) {
      response.error(res, 500, error.message);
    }
  },

  async addUserToOrganization(req, res) {
    const { email } = req.body;
    try {
      const user = await User.findOneAndUpdate({ email }, req.body, { upsert: true, new: true, runValidators: true });
      const updatedOrganization = await Organization.findOne(
        { urlname: req.params.urlname }
      );
      updatedOrganization.employees.push(user._id);
      updatedOrganization.save(err => {
        if (err) {
          return response.error(res, 500, `User could not be added to organization`);
        }
        senduserEmail(user, updatedOrganization, req, res);
      });
    } catch (error) {
      response.error(res, 500, error.message);
    }
  },

  async fetchOrganization(req, res) {
    Organization.find({ urlname: req.params.urlname }, (err, org) => {
      if (org) {
        response.success(res, 200, org);
      }

      if (err) {
        response.error(res, 500, err);
      }
    })
  },
  async deleteOrganization(req, res) {
    Organization.deleteOne({ urlname: req.params.urlname }, (err) => {
      if (err) {
        response.error(res, 404, err)
      }
      response.success(res, 200, 'Organization successfully deleted');
    })
  },


  async updateOrganization(req, res) {
    Organization.findOneAndUpdate({ urlname: req.params.urlname }, req.body, (err, org) => {
      if (err) {
        response.error(res, 404, err)
      }
      response.success(res, 200, 'Organization successfully deleted');
    })
  },

  async fetchEmployeeData(req, res) {
    // const { username, urlname } = req.params;
    const user =await User.findOne({ username: req.params.username }).lean().exec();
    if(user) {
      Organization.findOne({ urlname: req.params.urlname, employees: user._id}, (err, org) => {
        if (err) {
          response.error(res, 404, err)
        }
        response.success(res, 200, user);
      })
    }else {
      response.error(res, 404, "No user with that username")
    }

  },

  async verifyEmployee(req, res) {
    if (!req.params.token) {
      return response.error(res, 400, "No token attached")
    }

    Token.findOne({ token: req.params.token }, (err, token) => {
      if (!token) {
        return response.error(res, 400, 'We were unable to find a valid token. Your token may have expired.');
      }
      if (token) {
        User.findOne({ _id: token.userId }, (err, user) => {
          if (!user) {

            return response.error(res, 400, 'We were unable to find a user for this token.')
          }
          if (user.isVerified) {
            return response.error(res, 400, 'This user has already been verified.')
          }
          user.isVerified = true;
          user.save(function (err) {
            if (err) {
              return res.status(500).json({ message: err.message });
            }
          });
          response.success(res, 200, `User${username} has been successfully verified`);

        })
      }
    })
  }


};



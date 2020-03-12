import { Organization } from "../models/Organization";
import { User } from "../models/User";
import { Token } from "../models/Token";
const response = require("../middlewares/response");
import { crudControllers } from "../../utils/crud";
import { sendCreateOrganisationEmail, senduserEmail } from "../middlewares/mail";
import { checkUrlExists } from "../middlewares/middleware";
import { userSchema } from '../models/User';
import { organizationSchema } from '../models/Organization';
const { getDBInstance } = require('../database/multiDb.js');




const errors = [];

module.exports = {
// Render page to create new organization
renderCreateOrgPage(req,res){
  if(!req.user)return res.status(403).redirect('/auth/login?redirect=/org/new');
  else if(req.user.createdOrganizations.length >=10 || req.user.role == 'user') return res.status(403).render('403', {message: 'You are not permitted to create more organizations'})
  else return res.status(200).render('organization/new', {
    user:req.user,baseUrl:`http://${req.headers.host}/org/`
  })
},

  // Controller that creates a new organization. The user that creates the organization is immediately added as the
  //the an admin of the newly created organisation.
  async createOrganization(req, res) {
    try {
      if (req.user.createdOrganizations.length >= 10) { errors.push('User has registered more than 10 organizations') }
      if (checkUrlExists(req.body.urlname)) { errors.push(`Organization with the username ${req.body.urlname} already exists`) }
      if (errors.length === 0) {
        const dbName = req.body.urlname.toLowerCase();
        getDBInstance(dbName);
        const newOrg = await Organization.create(req.body);
        newOrg.urlname = req.body.urlname.toLowerCase();
        newOrg.admin.push(req.user._id);
        newOrg.employees.push(req.user._id);
        newOrg.save();
        const user = await User.findById( req.user._id );
        user.role = 'admin';
        user.createdOrganizations.push(newOrg._id);
        user.save();
        sendCreateOrganisationEmail(user, newOrg, req, res);
       return res.status(200).redirect(`/org/${newOrg.urlname}`)
      } else {
        return res.status(500).render('error/500',{message:errors})
      }
    } catch (error) {
      return res.status(500).render('error/500',{message:error})
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
       return res.status(200).render('organization/adminDashboard', {admin:req.user, org, org})
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
          response.success(res, 200, user);

        })
      }
    })
  },
  checkIfOrgExists(req,res,next){
    Organization.findOne({urlname: req.params.urlname}, (err,org)=>{
      if(err)return err
      else if(!org) return response.error(res,204,"Url available")
      else if(org) return response.error(res,200,"Url not available")
    })
  }


};



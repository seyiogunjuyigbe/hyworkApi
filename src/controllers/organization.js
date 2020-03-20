import { Organization } from "../models/Organization";
import { User } from "../models/User";
import { Token } from "../models/Token";
const response = require("../middlewares/response");
import { sendCreateOrganisationEmail, senduserEmail, sendMailToTheseUsers } from "../middlewares/mail";
import { checkUrlExists } from "../middlewares/middleware";
const { getDBInstance } = require('../database/multiDb.js');
const nanoid = require('nanoid');
const passport = require('passport');
import {passportConfig} from '../config/passport';
import {MAIL_SENDER} from '../config/constants';
passportConfig(passport);




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
        const { TenantOrganization } = getDBInstance(dbName).models;
        const newOrg = await Organization.create(req.body);
        newOrg.urlname = req.body.urlname.toLowerCase();
        newOrg.admin.push(req.user._id);
        newOrg.employees.push(req.user._id);
        newOrg.save();
        const tOrg = await TenantOrganization.create(req.body);
        tOrg.admin.push(req.user._id);
        tOrg.employees.push(req.user._id);
        tOrg.save();
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
    const { firstName, lastName, username } = req.body;
    const { User, TenantOrganization } = req.dbModels;
    try {
      const user = await new User({...req.body,tempPassword:nanoid(8),firstName:firstName.trim(),lastName:lastName.trim()});
      user.username = username.trim().toLowerCase()
      User.register(user,user.tempPassword, (err,user)=>{
        if(err){
          return response.error(res,500,err.message);
      }
      else{
           user.save((err)=>{
            if(err) return res.status(500).json({err})
            TenantOrganization.findOne({urlname: req.params.urlname }, (err,updatedOrganization)=>{
          if (err) {
            return response.error(res, 500, err.message);
          } else if(!updatedOrganization) return response.error(res,404,'Organization not found')
             updatedOrganization.employees.push(user._id);
             updatedOrganization.save(err => {
               if (err) {
                  return response.error(res, 500, `User could not be added to organization`);
                  }
                senduserEmail(user, updatedOrganization, req, res);
                });
            })
           });
          }
      })
    }
    catch (error) {
          response.error(res, 500, error.message);
        }
  },

  async fetchOrganization(req, res) {
    const { TenantOrganization } = req.dbModels;
    TenantOrganization.find({ urlname: req.params.urlname }, (err, org) => {
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
    const { User,Token } = req.dbModels;
    if (!req.params.token) {
      return response.error(res, 400, "No token attached")
    }
    Token.findOne({ token: req.params.token }, (err, token) => {
      if(err) return response.error(res,500,err.message)
      else if (!token) {
        return response.error(res, 400, 'We were unable to find a valid token. Your token may have expired.');
      }
      if (token) {
        User.findOne({ _id: token.userId }, (err, user) => {
          if (!user) {
            return response.error(res, 400, 'We were unable to find a user for this token.')
          }
          else if (user.isVerified) {
            return response.error(res, 400, 'This user has already been verified.')
          }
           else{
                    user.isVerified = true;
                    user.save()
                    return res.redirect(`/org/${req.params.urlname}/user/${token.token}/onboard`);
          }
          
        })
      }
    })
  },
  renderPasswordPageForUser(req,res){
    const{User,Token} = req.dbModels;
    if (!req.params.token) {
      return response.error(res, 400, "No token attached")
    }
    Token.findOne({ token: req.params.token }, (err, token) => {
      if(err) return response.error(res,500,err.message)
      else if (!token) {
        return response.error(res, 400, 'We were unable to find a valid token. Your token may have expired.');
      }
      if (token) {
        User.findOne({ _id: token.userId }, (err, user) => {
          if (!user) {
            return response.error(res, 400, 'We were unable to find a user for this token.')
          }
          else if (user.isVerified) {
            return response.error(res, 400, 'This user has already been verified.')
          }
           else{
               return res.render('createPassword', {user,token:token.token})         
          }
          
        })
      }
    })
  },
  createPasswordForUser (req,res){
    const{User,Token} = req.dbModels;
    const {username} = req.body;
    const {token} = req.params;
    Token.findOne({token}, (err,token)=>{
      if(err) return response.error(res,500,err.message)
      else if(!token) return response.error(res,404,'Token not found')
      else{
            User.findOne({username}, (err,user)=>{
              if(err) return response.error(res,500,err.message);
              else if(!user) return response.error(res,404, 'User not found');
              else if(req.body.password !== req.body.confirmPassword){
                return response.error(res,422,'Passwords do not match')
              }
              else{
                user.setPassword(req.body.password, (err,user)=>{
                  if(err){return res.status(500).render('500')}
                  user.tempPassword = "";

                  user.isVerified = true;  
                user.save((err) => {
                  if (err) return res.status(500).render('500');
                 else{
                // send email 
                const mailOptions = {
                  to: user.email,
                  from: MAIL_SENDER,
                  subject: "Your password has been set",
                  text: `Hi ${user.username} \n 
                  This is a confirmation that the password for your account ${user.email} has just been set.\n`
              };
              sendMailToTheseUsers(req,res,mailOptions);
              response.success(res,200,'User has been fully onboarded')
      }
    })

  })
}
    })
  }})
}
,
  checkIfOrgExists(req,res,next){
    Organization.findOne({urlname: req.params.urlname}, (err,org)=>{
      if(err)return err
      else if(!org) return response.error(res,204,"Url available")
      else if(org) return response.error(res,200,"Url not available")
    })
  }


};



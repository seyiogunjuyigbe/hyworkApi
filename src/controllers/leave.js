import {User} from '../models/User';
import {Organization} from '../models/Organization';
const validate = require('../middlewares/validate');
const { check,validationResult } = require('express-validator');
import {Leave} from '../models/Leave';
import {Department} from '../models/Department';
const nodemailer = require('nodemailer');
const response = require('../middlewares/response');
import {MAIL_PASS, MAIL_SENDER, MAIL_SERVICE, MAIL_USER} from '../config/constants';

export const createLeaveRequest = (req,res)=>{
  if(!req.user)return response.error(res,401,'You need to be signed in')
  else{ 
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
      let error = []; errors.array().map((err) => error.push(err.msg));

      return res.status(422).json({error});
      } 

        else{
        if((new Date(req.body.startDate)).getTime() >= (new Date(req.body.endDate)).getTime()){
         return response.error(res,422,'End date must be later than start date')
         }
         else if((new Date(req.body.startDate)).getTime() <= (new Date()).getTime()){
        return response.error(res,422,'Start date can not be earlier than today')

         }
         else{
           
         Organization.findOne({urlname:req.params.urlname}, (err,org)=>{
        if(err)return response.error(res,500,err.message)
        else if(!org) {console.log(req.params);return response.error(res,404, 'Organization not found')}
        else{
          var today = new Date();
            Leave.create({...req.body, dateApplied : new Date(),applicant:req.user}, (err,leave)=>{
                if(err)return response.error(res,500,err.message)
                else{
                    leave.save();
                    org['leaves'].push(leave)
                    org.save();
                Department.findOne({employees: { $in: req.user._id}}).populate('manager').exec((err,department)=>{
        if(err) return response.error(res,500,err.message)
        else if(!department) response.error(res,404, 'Department not found')   
        else if(!department.employees.includes(req.user._id)) {
          return response.error(res,401, 'You do not belong to any department in this organization')
        } 
        else{
          if(!department.manager) return response.error(res,404,'Manager not found')
          else {
       let transporter = nodemailer.createTransport({
      service: MAIL_SERVICE,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS
      }
    });
    let mailOptions = {
      from: MAIL_SENDER,
      to: department.manager.email,
      subject: "Leave Notice",
      html: `<h2>Hi ${department.manager.username} </h2>\n,
            <p>A leave request has been received from ${req.user.firstName} ${req.user.lastName}</p>
            <a href="http://${req.headers.host}/org/:urlname/d/${department._id}/leave/${leave.token}/approve">Approve Leave</a><br>
            <a href="http://${req.headers.host}/org/:urlname/d/${department._id}/leave/${leave.token}/decline">DeclineLeave</a>
            `
          };
          transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                  return res.status(500).json({success: false, error: error});
              } else {
                  console.log('mail sent to ' + department.manager.email)
                  return res.status(200).json({message: 'Your leave request has been received'});
              }
      }) } 
      }
        })               
            }
          
            })
        }}
        )}}
      }
    }

    export const approveLeave = (req,res)=>{
    Department.findById(req.params.deptId, (err,dept)=>{
          if(err)return response.error(res,500, err.message)
          else if(!req.user)return response.error(res,403, 'You need to be logged in');
          else if(!dept) return response.error(res,404, 'Department not found')
          else if(String(dept.manager)!== String(req.user._id)) return response.error(res,403, 'You need to be an admin to do that');
        else{
        Leave.findOne({token:req.params.token}, (err,leave)=>{
          if(err)return response.error(res,500,err.message);
          else if(!leave) return response.error(res,404, 'Leave not found');
          else if(String(leave.applicant) == String(req.user._id)) return response.error(res,403, 'You cannot respond yto your own leave request');          
          else if(leave.approvalStatus !== 'Pending') return response.error(res,400,'Leave request has already been responded to')
          else{
            leave.approvalStatus = 'Approved';
            leave.save();
            User.findById(leave.applicant, (err,applicant)=>{
              if(err)return response.error(res,500,err.message);
              else if(!applicant) return response.error(res,404, 'Leave applicant not found');
              else{
            let transporter = nodemailer.createTransport({
              service: MAIL_SERVICE,
              auth: {
                user: MAIL_USER,
                pass: MAIL_PASS
              }
            });
            let mailOptions = {
              from: MAIL_SENDER,
              to: applicant.email,
              subject: "Leave Request Approved",
              html: `<h2>Hi ${applicant.username} </h2>\n,
                    <p>Your leave request has been approved by ${req.user.firstName} ${req.user.lastName}</p>
                    <p>We hope you have a good time</p>
                    `
                  };
                  transporter.sendMail(mailOptions, function(error, info){
                      if (error) {
                        console.log('mail not sent to due to poor connection')
                          return res.status(500).json({success: true, problem: 'Mail not sent', error});
                      } else {
                          console.log('mail sent to ' + applicant.email)
                          return res.status(200).json({message: 'Your leave request has been accepted'});
                      }
                  }); 
                
                }
              })

          }
        })
      }
      })

  }


  export const declineLeave = (req,res)=>{
    Department.findById(req.params.deptId, (err,dept)=>{
          if(err)return response.error(res,500, err.message)
          else if(!req.user)return response.error(res,403, 'You need to be logged in');
          else if(!dept) return response.error(res,404, 'Department not found')
          else if(String(dept.manager)!== String(req.user._id)) return response.error(res,403, 'You need to be an admin to do that');
        else{
        Leave.findOne({token:req.params.token}, (err,leave)=>{
          if(err)return response.error(res,500,err.message);
          else if(!leave) return response.error(res,404, 'Leave not found');
          else if(String(leave.applicant) == String(req.user._id)) return response.error(res,403, 'You cannot respond yto your own leave request');          
          else if(leave.approvalStatus !== 'Pending') return response.error(res,400,'Leave request has already been responded to')
          else{
            leave.approvalStatus = 'Declined';
            leave.save();
            User.findById(leave.applicant, (err,applicant)=>{
              if(err)return response.error(res,500,err.message);
              else if(!applicant) return response.error(res,404, 'Leave applicant not found');
              else{
            let transporter = nodemailer.createTransport({
              service: MAIL_SERVICE,
              auth: {
                user: MAIL_USER,
                pass: MAIL_PASS
              }
            });
            let mailOptions = {
              from: MAIL_SENDER,
              to: applicant.email,
              subject: "Leave Request Approved",
              html: `<h2>Hi ${applicant.username} </h2>\n,
                    <p>Your leave request has been declined by ${req.user.firstName} ${req.user.lastName} for some reasons</p>
                    `
                  };
                  transporter.sendMail(mailOptions, function(error, info){
                      if (error) {
                        console.log('mail not sent to due to poor connection')
                          return res.status(500).json({status: 'declined', problem: 'Mail not sent', error});
                      } else {
                          console.log('mail sent to ' + applicant.email)
                          return res.status(200).json({message: 'Your leave request has been declined'});
                      }
                  }); 
                
                }
              })

          }
        })
      }
      })

  }
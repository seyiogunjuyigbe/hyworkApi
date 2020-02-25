import {User} from '../models/User';
import {Organization} from '../models/Organization';
import {Leave} from '../models/Leave';
import {Department} from '../models/Department';
const nodemailer = require('nodemailer');
const response = require('../middlewares/response');

export const createLeaveRequest = (req,res)=>{
    if(!req.user)return response.error(res,401,'You need to be signed in')
    else{  
         Organization.findById(req.params.urlname, (err,org)=>{
        if(err)return response.error(res,500,err.message)
        else if(!org) return response.error(res,404, 'Organization not found')
        else if(!org.admins.includes(req.user))return response.error(res,401, 'Unauthorized access')
        else{
            Leave.create(...req.body, (err,leave)=>{
                if(err)return response.error(ress,500,err.message)
                else{
                    leave.applicant = req.user;
                    leave.save();
                    org.push(leave)
                    org.save();
                Department.findOne({ employees: { $in: [req.user._id] } }, (err,department)=>{
        if(err) return response.error(res,500,err.message)
        else if(!department)return response.error(res,403,'You do not belong to any department in this organization')     
        else{
        var manager;
        User.findById(department.manager, (err,man)=>{
          if(err)return response.error(res,500,'Internal Server Error')
          else if(!man) return response.error(res,404,'Manager not found')
          else manager = man;
        })
       let transporter = nodemailer.createTransport({
      service: MAIL_SERVICE,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS
      }
    });
    let mailOptions = {
      from: MAIL_SENDER,
      to: manager.email,
      subject: "Leave Notice",
      html: `<h2>Hi ${manager.username} </h2>\n,
            <p>A leave request has been received from ${req.user.firstName} ${req.user.lastName}</p>
            <a href="http://${req.headers.host}/org/:urlname/d/:deptId/leave/${leave.token}/approve">Approve Leave</a><br>
            <a href="http://${req.headers.host}/org/:urlname/d/:deptId/leave/${leave.token}/decline">DeclineLeave</a>
            `
          };
          transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                  return res.status(500).json({success: false, error: error});
              } else {
                  console.log('mail sent to ' + manager.email)
                  return res.status(200).json({message: 'Your leave request has been received'});
              }
          }); 
        } 
        })               
            }
          
            })
        }}
        )}}


    export const approveLeave = (req,res)=>{
    Department.findById(req.params.deptId, (err,dept)=>{
          if(err)return response.error(res,500, err.message)
          else if(!req.user)return response.error(res,401, 'You need to be logged in');
          else if(!dept.admins.includes(req.user._id)) return response.error(res,403, 'You need to be an admin to do that');
        else{
        Leave.findOne({token:req.params.token}, (err,leave)=>{
          if(err)return response.error(res,500,err.message);
          else if(!token) return response.error(res,404, 'Leave not found');
          else if(leave.status !== 'Pending') return response.error(res,400,'Leave request has already been responded to')
          else{
            leave.status = 'Approved';
            leave.save();
            var applicant;
            User.findById(leave.applicant, (err,user)=>{
              if(err)return response.error(res,500,err.message);
              else if(!user) return response.error(res,404, 'Leave applicant not found');
              else applicant = user
            })
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
                          return res.status(500).json({success: false, error: error});
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


  export const declineLeave = (req,res)=>{
    Department.findById(req.params.deptId, (err,dept)=>{
          if(err)return response.error(res,500, err.message)
          else if(!req.user)return response.error(res,401, 'You need to be logged in');
          else if(!dept.admins.includes(req.user._id)) return response.error(res,403, 'You need to be an admin to do that');
        else{
        Leave.findOne({token:req.params.token}, (err,leave)=>{
          if(err)return response.error(res,500,err.message);
          else if(!token) return response.error(res,404, 'Leave not found');
          else if(leave.status !== 'Pending') return response.error(res,400,'Leave request has already been responded to')
          else{
            leave.status = 'Declined';
            leave.save();
            var applicant;
            User.findById(leave.applicant, (err,user)=>{
              if(err)return response.error(res,500,err.message);
              else if(!user) return response.error(res,404, 'Leave applicant not found');
              else applicant = user
            })
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
              subject: "Leave Request Declined",
              html: `<h2>Hi ${applicant.username} </h2>\n,
                    <p>Your leave request has been declined by ${req.user.firstName} ${req.user.lastName}</p>
                    `
                  };
                  transporter.sendMail(mailOptions, function(error, info){
                      if (error) {
                          return res.status(500).json({success: false, error: error});
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
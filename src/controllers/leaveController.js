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
                Department.findOne({ employees: { $in: [req.user] } }, (err,department)=>{
        if(err) return response.error(res,500,err.message)
        else if(!department)return response.error(res,404,'Department not found')     
        let manager = department.manager
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
      text: `Hi ${manager.username} \n,
            A leave request has been received from ${req.user.firstName} ${req.user.lastName}`

          };
          transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                  return res.status(500).json({success: false, error: error});
              } else {
                  console.log('mail sent to ' + manager.email)
                  return res.status(200).json({message: 'Your leave request has been received'});
              }
          }); 
        })               
            }
          
            })
        }})
    }}
export const getDept = (req,res)=>{
  if(req.user)return response.error(res,403,'Unauthorized')
  Department.findOne({ employees: { $in: [req.user] } }, (err,department)=>{
    if(err)return response.error(res,500,'Internal Error');
    else if(!department)return response.error(res,404,'Internal Error');
    else return res.status(200).json({department})
  })
}

  export const approveLeave = (req,res)=>{

  }
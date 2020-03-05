import { Case } from "../models/Case";
import {Organization} from '../models/Organization';
import {Department} from "../models/Department";
import {User} from '../models/User';
import {Comment} from '../models/Comment';
const response = require('../middlewares/response')
const nodemailer = require('nodemailer');
import {MAIL_SENDER} from '../config/constants';
import {sendMailToTheseUsers} from '../middlewares/mail'

// Create new case
// POST /org/:urlname/case/new
// Parms: urlname
// req.body: title, category, description, respondents[i]
export const createCase = (req,res)=>{
Organization.findOne({urlname:req.params.urlname}).populate('employees', "username email -_id")
.then((org=>{
    var list  = [];
    var emailList = []
    org.employees.forEach(employee=>list.push(employee.username)); 
         if(!list.includes(...req.body.respondents)){
        return response.error(res,422, 'You have included a respondent who is not an employee of this organization');
        }
        else{
            req.body.respondents.forEach((respondent)=>{
                var i = list.indexOf(respondent);
                emailList.push(org.employees[i].email);
            })
            console.log(emailList);
            User.findById(req.user._id, (err,user)=>{
                if(err)return response.error(res,500,err.message);
                else if(!user) return response.error(res,422,'User not found')
                else{
                     Case.create({...req.body, createdBy:user.username},(err,newCase)=>{
                    if(err) return response.error(res,500,err.message);
                    else{
                        newCase.save();
                        user.cases.push(newCase);
                        org.cases.push(newCase);
                        user.save();
                        org.save();
                        var mailOptions = {
                            from: MAIL_SENDER,
                            to: emailList,
                            subject: `New case: (${newCase.title}) needs your response`,
                            html: 
                                ` 
                                <p style="font-family:candara;font-size:1.2em">A new case was raised by ${req.user.firstName} ${req.user.lastName}.</p>
                                <ul>
                                <li style="font-family:candara;font-size:1.2em">Subject: ${newCase.title}</li>
                                <li style="font-family:candara;font-size:1.2em">Category: ${newCase.category}</li>
                                <li style="font-family:candara;font-size:1.2em">Priority: ${newCase.priority}</li>
                                <li style="font-family:candara;font-size:1.2em">Details: ${newCase.description}</li>
                                </ul>
                                <a href="http://${req.headers.host}/org/${org.urlname}/case/${newCase._id}/view" style="font-family:candara;font-size:1.2em">Click to view case</a>
                                    `,
                                };
                        sendMailToTheseUsers(req,res,mailOptions)
                        return response.success(res,200,'Case created successfully')
                            }
                        })
                    }
               })
        }
    }
))
.catch((err) => {return response.error(res,500,err.message)})
}


// Respond to existing case
// @POST /org/:urlname/case/:case_id/comment/new
// params: urlname,case_id
// req.body: notes
export const respondToCase =(req,res)=>{
Organization.findOne({urlname:req.params.urlname}).populate("employees").exec((err,org)=>{
    if(!org.cases.includes(req.params.case_id)) return response.error(res,404,'Case not found');
    else {
        Case.findById(req.params.case_id).populate('comments').exec((err,thisCase)=>{
            if(err) response.error(res,500,err.message)
            else if(!thisCase)return response.error(res,404,'Case not found');
            else if (thisCase.createdBy !== req.user._id && !thisCase.respondents.includes(req.user.username)){
                return response.error(res,403,'You are not authorized as you are neither the creator of this case nor are you one of the respondents')
            }
            else {
                Comment.create({...req.body,sender:req.user,sentFor:thisCase,
                                timeSent:new Date().toUTCString(),notes:req.body.notes,recipients:thisCase.respondents
                            }).then((comment)=>{
                                var list  = [];
                                var emailList = []
                                org.employees.forEach(employee=>list.push(employee.username)); 
                                    thisCase.respondents.forEach((respondent)=>{
                                            var i = list.indexOf(respondent);
                                            emailList.push(org.employees[i].email);
                                 })
                                comment.save();
                                thisCase.comments.push(comment);
                                thisCase.save();
                                var mailOptions = {
                                    from: MAIL_SENDER,
                                    to: emailList,
                                    subject: `A new response to case: (${thisCase.title})`,
                                    html: 
                                        ` 
                                        <p style="font-family:candara;font-size:1.2em">A new response by ${comment.sender.firstName} ${comment.sender.lastName} to case: ${thisCase.title}.</p>
                                        <ul>
                                        <li style="font-family:candara;font-size:1.2em">Case: ${thisCase.title}</li>
                                        <li style="font-family:candara;font-size:1.2em">Comment: ${comment.notes}</li>
                                        <li style="font-family:candara;font-size:1.2em">Sent on: ${comment.timeSent}</li>
                                        </ul>
                                        <a href="http://${req.headers.host}/org/${org.urlname}/case/${thisCase._id}/view" style="font-family:candara;font-size:1.2em">Click to view case</a>

                                            `,
                                        };
                                sendMailToTheseUsers(req,res,mailOptions);
                                console.log({thisCase})
                            })
                            .catch(err=>response.error(res,500,err.message))
            }
        })
    }
})}

// Fetch case to view comments
// @GET /org/:urlname/case/:case_id/view
export const fethThiscase = (req,res)=>{
Organization.findOne({urlname:req.params.urlname}).populate("employees").exec((err,org)=>{
    if(!org.cases.includes(req.params.case_id)) return response.error(res,404,'Case not found');
    else {
        Case.findById(req.params.case_id).populate('comments', "notes sender timeSent").exec((err,thisCase)=>{
            if(err) response.error(res,500,err.message)
            else if(!thisCase)return response.error(res,404,'Case not found');
            else if (thisCase.createdBy !== req.user._id && !thisCase.respondents.includes(req.user.username)){
                return response.error(res,403,'You are not authorized as you are neither the creator of this case nor are you one of the respondents')
            }
            else {
                response.success(res,200,thisCase)
            }
        })
    }
})
}


// Mark case as answered, unanswered,etc
// @POST /org/:urlname/case/:case_id/status/change
// req.body: status
export const changeCaseStatus = (req,res)=>{
    Organization.findOne({urlname:req.params.urlname}).populate("employees").exec((err,org)=>{
        if(!org.cases.includes(req.params.case_id)) return response.error(res,404,'Case not found');
        else {
            Case.findById(req.params.case_id, (err,thisCase)=>{            
                 if(err){return response.error(res,500,err.message)}
               else if(!thisCase)return response.error(res,404,'Case not found');
                else if (thisCase.createdBy !== req.user.username){
                    return response.error(res,403,'You are not authorized as you are not the creator of this case')
                }
                else {
                    thisCase.status = req.body.status;
                    thisCase.save((err,done)=>{
                      if(err){return response.error(res,500,err.message)}
                    else return res.status(200).redirect(`/org/${org.urlname}/case/${thisCase._id}/view`)
                    });
                }
            })
        }
    })
}


// Invite another employe to join case comment thread
// @POST /org/:urlname/case/:case_id/respondent/new
// Body: newRespondents[i]
export const inviteRespondentToCase = (req,res)=>{
    Organization.findOne({urlname:req.params.urlname}).populate("employees").exec((err,org)=>{
        if(!org.cases.includes(req.params.case_id)) return response.error(res,404,'Case not found');
        else {
            var list  = [];
    var emailList = []
    org.employees.forEach(employee=>list.push(employee.username)); 
         if(!list.includes(...req.body.newRespondents)){
        return response.error(res,422, 'You have included a respondent who is not an employee of this organization');
        }
        else{
            req.body.newRespondents.forEach((respondent)=>{
                var i = list.indexOf(respondent);
                emailList.push(org.employees[i].email);
            })
            Case.findById(req.params.case_id, (err,thisCase)=>{            
                 if(err){return response.error(res,500,err.message)}
               else if(!thisCase)return response.error(res,404,'Case not found');
                else if (thisCase.createdBy !== req.user.username){
                    return response.error(res,403,'You are not authorized as you are not the creator of this case')
                }
                else if(thisCase.respondents.includes(...req.body.newRespondents)){
                    return response.error(res,409,'Error... you added someone who is already a respondent on this case')
                }
                else {
                    thisCase.respondents.push(...req.body.newRespondents)
                    thisCase.save((err,done)=>{
                      if(err){return response.error(res,500,err.message)}
                    else {
                        var mailOptions = {
                            from: MAIL_SENDER,
                            to: emailList,
                            subject: `You have been invited to a thread`,
                            html: 
                                ` 
                                <p style="font-family:candara;font-size:1.2em">Your response is needed on this ongoing thread:  ${thisCase.title}.</p>
                                <ul>
                                <li style="font-family:candara;font-size:1.2em">Case: ${thisCase.title}</li>
                                <li style="font-family:candara;font-size:1.2em">You were invited by: ${req.user.firstName} ${req.user.lastName} </li>
                                </ul>
                                <a href="http://${req.headers.host}/org/${org.urlname}/case/${thisCase._id}/view" style="font-family:candara;font-size:1.2em">Click to view case</a>

                                    `,
                                };
                        sendMailToTheseUsers(req,res,mailOptions);
                        console.log({thisCase})
                        return response.success(res,200,'Respondents have been notified to join this thread')
                    }
                    });
                }
            })
        }
}})}
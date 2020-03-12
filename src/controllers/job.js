
import {Job} from '../models/Job';
import {User} from '../models/User';
import {Organization} from '../models/Organization'; 
const response = require('../middlewares/response')
import {sendMailToTheseUsers} from '../middlewares/mail';
import {MAIL_SENDER} from '../config/constants'
export const createJob = (req,res)=>{
    let {urlname} = req.params
    Organization.findOne({urlname}).populate("employees", "email username -_id").exec((err,org)=>{
        if(err) return response.error(res,500,err.message)
        else if(!org) return response.error(res,404, 'Org not found')
        else{
            var list  = [];
            var emailList = []
            org.employees.forEach(employee=>list.push(employee.username)); 
            if(typeof(req.body.assignees) !== 'undefined'){
                if(!list.includes(...req.body.assignees)){
                return response.error(res,422, 'You have included a respondent who is not an employee of this organization');
            }
            else{
                req.body.assignees.forEach((assignee)=>{
                    var i = list.indexOf(assignee);
                    emailList.push(org.employees[i].email);
                })
            }}
            let dateCreated = new Date();
            let createdBy = req.user.username
            Job.create({...req.body,dateCreated,createdBy}, (err,thisJob)=>{
                if(err) return response.error(res,500,err.message);
                else {
                    if (thisJob.ratePerHour !== 0) thisJob.isBillable = true;
                    thisJob.save();
                    var mailoptions = {
                        from: MAIL_SENDER,
                            to: emailList,
                            subject: `A job has been assigned to you`,
                            html: 
                                ` 
                                <p style="font-family:candara;font-size:1.2em">Hi, you have been assigned to a new job.</p>
                                <ul>
                                <li style="font-family:candara;font-size:1.2em">Subject: ${thisJob.title}</li>
                                <li style="font-family:candara;font-size:1.2em">Duration: ${thisJob.hours} hours</li>
                                <li style="font-family:candara;font-size:1.2em">Paid job: ${thisJob.isBillable}</li>
                                <li style="font-family:candara;font-size:1.2em">Details: ${thisJob.description}</li>
                                </ul>
                                <a href="http://${req.headers.host}/org/${org.urlname}/job:/" style="font-family:candara;font-size:1.2em">Click to view job</a>
                                    `,                  
                                  }
                                  if(emailList.length >= 1){
                                      sendMailToTheseUsers(req,res,mailoptions)
                                  }
                                  
                                  return response.success(res,200,thisJob)
                }
            })
        }
    })
}
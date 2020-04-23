// Create a new job
// @Params: urlname
// Method: POST
// Access: logged in admin
const response = require('../middlewares/response')
import { sendMailToTheseUsers } from '../middlewares/mail';
import { MAIL_SENDER } from '../config/constants'
export const createProject =(req,res)=>{
    let{Project} = req.dbModels
    let{urlname} = req.params
let {title,description}= req.body
Project.create({title,description})
.then(project=>{
    project.save();
    return response.success(res,200,'Project created successfully')
})
.catch(err=>{
    return response.error(res,500,err.message)
})

}
export const createJob = (req, res) => {
    let { urlname } = req.params
    const { TenantOrganization, Job } = req.dbModels
    TenantOrganization.findOne({ urlname }).populate("employees", "email username -_id").exec((err, org) => {
        if (err) return response.error(res, 500, err.message)
        else if (!org) return response.error(res, 404, 'Org not found')
        else {
            var list = [];
            var emailList = []
            org.employees.forEach(employee => list.push(employee.username));
            if (typeof (req.body.assignees) !== 'undefined') {
                if (!list.includes(...req.body.assignees)) {
                    return response.error(res, 422, 'You have included an assignee who is not an employee of this organization');
                }
                else {
                    req.body.assignees.forEach((assignee) => {
                        var i = list.indexOf(assignee);
                        emailList.push(org.employees[i].email);
                    })
                }
            }
            let dateCreated = new Date();
            let createdBy = req.user.username
            Job.create({ ...req.body, dateCreated, createdBy, createdFor: org.urlname }, (err, thisJob) => {
                if (err) return response.error(res, 500, err.message);
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
                    if (emailList.length >= 1) {
                        sendMailToTheseUsers(req, res, mailoptions)
                    }

                    return response.success(res, 200, thisJob)
                }
            })
        }
    })
}


// Fetch a job by ID
// @Params: urlname, job_id
// Method: GET
// Access: logged in employee who is the job creator or assignee
export const fetchThisJob = (req, res) => {
    const { Job } = req.dbModels;
    Job.findById(req.params.job_id, (err, thisJob) => {
        if (err) return response.error(res, 500, err.message)
        else if (!thisJob) return response.error(res, 404, 'Requested job not found')
        else if (thisJob.createdBy !== req.user.username && !thisJob.assignees.includes(req.user.username)) {
            return response.error(res, 403, 'You are not authorized to view this')
        } else {
            return response.success(res, 200, thisJob)
        }
    })
}

// Assign a job to an employee
// @Params: urlname, job_id
// Method: POST
// Access: logged in employee who is the job creator
export const assignThisJob = (req, res) => {
    const { TenantOrganization, Job } = req.dbModels
    TenantOrganization.findOne({ urlname: req.params.urlname }).populate("employees", "email username -_id").exec((err, org) => {
        if (err) return response.error(res, 500, err.message)
        else if (!org) return response.error(res, 404, 'Org not found')
        else {
            var list = [];
            var emailList = []
            org.employees.forEach(employee => list.push(employee.username));
            if (typeof (req.body.assignees) !== 'undefined') {
                if (!list.includes(...req.body.assignees)) {
                    return response.error(res, 422, 'You have included an assignee who is not an employee of this organization');
                }
                else {
                    req.body.assignees.forEach((assignee) => {
                        var i = list.indexOf(assignee);
                        emailList.push(org.employees[i].email);
                    })
                }
            }
            Job.findById(req.params.job_id, (err, thisJob) => {
                if (err) return response.error(res, 500, err.message);
                else if (!thisJob) return response.error(res, 404, 'Requested job not found');
                else if (thisJob.createdBy !== req.user.username) return response.error(res, 403, 'You are not authoeized to assign this job');
                else if (thisJob.assignees.includes(...req.body.assignees)) return response.error(res, 422, 'You assigned someone who is already on this job')
                else {
                    thisJob.assignees.push(...req.body.assignees);
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
                    if (emailList.length >= 1) {
                        sendMailToTheseUsers(req, res, mailoptions)
                    }
                    return response.success(res, 200, `this job has b3een assined to ${thisJob.assignees.join(', ')}`)
                }
            })
        }
    })
}


// Update a job
// @Params: urlname, job_id
// Method: POST
// Access: logged in employee who is the job creator
export const updateThisJob = (req, res) => {
    const { TenantOrganization, Job } = req.dbModels
    TenantOrganization.findOne({ urlname: req.params.urlname }).populate("employees", "email username -_id").exec((err, org) => {
        if (err) return response.error(res, 500, err.message)
        else if (!org) return response.error(res, 404, 'Org not found')
        else {
            var list = [];
            var emailList = []
            org.employees.forEach(employee => list.push(employee.username));
            if (typeof (req.body.assignees) !== 'undefined') {
                if (!list.includes(...req.body.assignees)) {
                    return response.error(res, 422, 'You have included an assignee who is not an employee of this organization');
                }
                else {
                    req.body.assignees.forEach((assignee) => {
                        var i = list.indexOf(assignee);
                        emailList.push(org.employees[i].email);
                    })
                }
            }
            Job.findByIdAndUpdate(req.params.job_id, req.body, (err, thisJob) => {
                if (err) return response.error(res, 500, err.message);
                else if (!thisJob) return response.error(res, 404, 'Requested job not found')
                else {
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
                    if (emailList.length >= 1) {
                        sendMailToTheseUsers(req, res, mailoptions)
                    }
                    return response.success(res, 200, 'this job has been successfully updated')
                }
            })
        }
    })
}
export const addJobToProject=(req,res)=>{
    let{Project,Job} = req.dbModels;
    let {project_id,job_id} = req.params;
    Project.findById(project_id)
    .then(project=>{
        if(!project) return response.error(res,404,'Project not found');
        else{
            Job.findById(job_id)
            .then(job=>{
                if(!job) return response.error(res,404,'Job not found');
                else{
                    project.jobs.push(job);
                    project.save();
                    return response.success(res,200,'Job added to project successfully')
                }
            })
            .catch(err=>{
                return response.error(res,500,err.message)
            })
        }
    })
}
const response = require('../middlewares/response')
import { checkIfJobLogExists, checkIfJobLogExistsAndUpdate } from '../middlewares/timelog'
export const startTimeLogForThisJob = (req, res) => {
    // fetch job
    // check if job exists in org db
    const { Job, Timelog, User } = req.dbModels
    Job.findOne({ _id: req.params.job_id, createdFor: req.params.urlname }, (err, job) => {
        if (err) return response.error(res, 500, err.message)
        else if (!job) return response.error(res, 404, 'Requested job not found');
        else if (!job.assignees.includes(req.user.username) && job.createdBy !== req.user.username ) return response.error(res, 403, 'Unauthorized access')
        else {
            Timelog.findOne({ user: req.user.username, relatedJob: job._id, endTime: undefined }, (err, log) => {
                if (err) return response.error(res, 500, err.message)
                else if (log) return response.error(res, 409, 'You already have an open log for this job')
                else {
                    Timelog.create({ ...req.body, startTime: new Date().getTime(), user: req.user.username, relatedJob: job._id }, (err, timelog) => {
                        if (err) return response.error(res, 500, err.message)
                        else {
                            User.findById(req.user._id, (err, user) => {
                                if (err) return response.error(res, 500, err.mesage)
                                else if (!user) return response.error(res, 404, 'User not found')
                                else {
                                    checkIfJobLogExists(user, job);
                                    timelog.save();
                                    job.timeLogs.push(timelog)
                                    return response.success(res, 200, timelog)
                                }
                            })

                        }
                    })
                }
            })
        }
    })

}


export const endTimeLogForThisJob = (req, res) => {
    const { Job, Timelog, User } = req.dbModels
    Job.findOne({ _id: req.params.job_id, createdFor: req.params.urlname }, (err, job) => {
        if (err) return response.error(res, 500, err.message)
        else if (!job) return response.error(res, 404, 'Requested job not found');
        else if (!job.assignees.includes(req.user.username) && job.createdBy !== req.user.username ) return response.error(res, 403, 'Unauthorized access')
        else {
            Timelog.findOne({ token: req.params.token, user: req.user.username, relatedJob: req.params.job_id }, (err, timelog) => {
                if (err) return response.error(res, 500, err.mesage)
                else if (!timelog) response.error(res, 404, 'Timelog not found');
                else if (timelog.endTime !== undefined) response.error(res, 403, 'You have closed this already')
                else {
                    timelog.endTime = new Date().getTime()
                    var timeDiff = Number(((timelog.endTime - timelog.startTime) / 3.6e+6)).toFixed(2)
                    timelog.save();
                    User.findById(req.user._id, (err, user) => {
                        if (err) return response.error(res, 500, err.mesage)
                        else if (!user) return response.error(res, 404, 'User not found');
                        else {
                            checkIfJobLogExistsAndUpdate(user, job, timeDiff);
                        }
                    })
                    return response.error(res, 200, timelog)
                }
            })

        }
    })
}


// Fetch user's logs for a job
// @GET
// params: :urlname, job_id
export const fetchMyLogsForThisJob = (req, res) => {
    const { Job, Timelog, User } = req.dbModels
    Job.findById(req.params.job_id, (err, job) => {
        if (err) return response.error(res, 500, err.mesage)
        else if (!job) return response.error(res, 404, 'Job not found')
        else {
            Timelog.find({ user: req.user.username, relatedJob: req.params.job_id }, (err, logs) => {
                if (err) return response.error(res, 500, err.message)
                else if (!logs) return response.error(res, 404, 'Logs not found for this job')
                else {
                    let hours = checkIfJobLogExists(req.user, job);
                    // console.log(hours)
                    return response.success(res, 200, { logs, totalHours: hours })
                }
            })
        }
    })

}

// Fetch logs for these users for this job
// Params: urlname,job_id,user[i]
export const fetchUsersLogsForThisJob = (req, res) => {
    const { Job, Timelog } = req.dbModels
    Job.findById(req.params.job_id, (err, job) => {
        if (err) return response.error(res, 500, err.mesage)
        else if (!job) return response.error(res, 404, 'Job not found')
        else {
            let user = req.query.user;
            var users = [];
            for (var i = 0; i <= user.length; i++) {
                users.push({ user: user[i] })
            }
            Timelog.find({ $or: users, relatedJob: req.params.job_id }).sort('user').exec((err, logs) => {
                if (err) return response.error(res, 500, err.message)
                else if (!logs) return response.error(res, 404, 'Logs not found for this job')
                else {

                    // let hours = checkIfJobLogExists(req.user,job);
                    // console.log(hours)
                    return response.success(res, 200, { logs })
                }
            })
        }
    })
}

export const submitTimesheetForThisJob = (req,res)=>{
    const {Timelog, Timesheet} = req.dbModels;
    const {startDate, endDate} = req.query;
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    Timelog.find({user: req.user.username, relatedJob: req.params.job_id, startTime:{$gte : start}, endTime: {$lte: end}})
    .then(logs=>{
        Timesheet.create({
            startDate,
            endDate,
            owner: req.user,
            logs,
        })
        .then(sheet=>{
            sheet.save();
            return response.success(res,200,'Timesheet submitted successfully')
        })
        .catch(err=>{
            return response.error(res,500,err.message)
        })
    })
}

export const fetchTimesheetForThisJob = (req,res)=>{
    const {Timesheet} = req.dbModels;
    const {sheet_id} = req.params;
    Timesheet.findOne({token:sheet_id})
        .then(sheet=>{
            if(!sheet) return response.error(res,404,'Sheet not found')
            else{
                return response.success(res,200,sheet)
            }
        })
        .catch(err=>{
            return response.error(res,500,err.message)
        })
}

export const approveTimesheetForThisJob = (req,res)=>{
    const {Timesheet} = req.dbModels;
    const {sheet_id} = req.params;
    Timesheet.findOne({token:sheet_id})
        .then(sheet=>{
            if(!sheet) return response.error(res,404,'Sheet not found')
            else{
                sheet.approvalStatus = 'approved';
                sheet.save()
                return response.success(res,200,sheet)
            }
        })
        .catch(err=>{
            return response.error(res,500,err.message)
        })
}
export const rejectTimesheetForThisJob = (req,res)=>{
    const {Timesheet} = req.dbModels;
    const {sheet_id} = req.params;
    Timesheet.findOne({token:sheet_id})
        .then(sheet=>{
            if(!sheet) return response.error(res,404,'Sheet not found')
            else{
                sheet.approvalStatus = 'rejected';
                sheet.save()
                return response.success(res,200,sheet)
            }
        })
        .catch(err=>{
            return response.error(res,500,err.message)
        })
}
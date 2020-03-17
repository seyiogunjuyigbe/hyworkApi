import {Job} from '../models/Job';
import {Timelog} from '../models/Timelog';
import {User} from '../models/User'
import {Organization} from '../models/Organization'
import { calcTimeDiffWithoutSec } from '../middlewares/attendanceCalc';
const response = require('../middlewares/response')

export const startTimeLogForThisJob =(req,res)=>{
    // fetch job
    // check if job exists in org db
    Job.findOne({_id:req.params.job_id,createdFor:req.params.urlname}, (err,job)=>{
        if(err) return response.error(res,500,err.message)
        else if(!job) return response.error(res,404,'Requested job not found');
        else if(!job.assignees.includes(req.user.username)) return response.error(res,403,'Unauthorized access')
        else{
            Timelog.create({...req.body,startTime:new Date().getTime(),user:req.user.username,relatedJob:job._id}, (err,timelog)=>{
                if(err) return response.error(res,500,err.message)
                else{
                    timelog.save();
                    job.timeLogs.push(timelog)
                    return response.success(res,200,timelog)
                }
            })
        }
    })

}


export const endTimeLogForThisJob =(req,res)=>{
    Job.findOne({_id:req.params.job_id,createdFor:req.params.urlname}, (err,job)=>{
        if(err) return response.error(res,500,err.message)
        else if(!job) return response.error(res,404,'Requested job not found');
        else if(!job.assignees.includes(req.user.username)) return response.error(res,403,'Unauthorized access')
        else{
            Timelog.findOne({token:req.params.token,user:req.user.username,relatedJob:req.params.job_id}, (err,timelog)=>{
                if(err) return response.error(res,500,err.mesage)
                else if(!timelog) response.error(res,404,'Timelog not found');
                else if(timelog.endTime !== undefined) response.error(res,403,'You have closed this already')
                else{
                    timelog.endTime = new Date().getTime();
                    var timeDiff = ((timelog.endTime - timelog.startTime)/3.6e+6).toFixed(2)
                    timelog.hoursWorked += timeDiff
                    timelog.save()
                    return response.error(res,200,timelog)
                }
            })
            Timelog.find({user:req.user.username,relatedJob:req.params.job_id}, (err,logs)=>{
                function calc(arr){
                    var count = 0
                    arr.forEach((x)=>{
                    count += x.hoursWorked
                    })
                    console.log(count)
                    }
                if(logs && !err){
                    calc(logs)
                } else{
                    console.log('No found')
                }
            })
            }})
        }
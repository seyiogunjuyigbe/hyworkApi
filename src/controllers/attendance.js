import {Attendance} from '../models/Attendance';
import {Shift} from '../models/Shift';
import {Organization} from '../models/Organization';
import { calcTimeDiff, fetchUserAttendance, calcTimeDiffWithoutSec } from '../middlewares/attendanceCalc';
import { User } from '../models/User';
const geoip = require ('geoip-lite');

// Clock in user
// @POST
// Access: logged in employee
// @body: :shiftId
export const clockIn = (req,res)=>{
    if(req.user){
        Organization.findOne({urlname:req.params.urlname, 
            employees: { $in:  req.user._id }},(err,org)=>{
            if(err){return res.status(500).json({message:err.message})}
            else if(!org){return res.status(404).json({message: 'Organization not found, please join one'})}
            else{
         Shift.findById(req.params.shift_id, (err,shift)=>{
        if(err){
            return res.status(500).json({message: err.message})
        } else if(!shift || String(shift.createdFor) !== String(org._id)){
            return res.status(422).json({message: 'Reference error; shift not found'})
        } 
         else{
            const today = new Date();
            const ip = (req.headers['x-forwarded-for'] || '').split(',').pop() || 
                        req.connection.remoteAddress || 
                        req.socket.remoteAddress || 
                        req.connection.socket.remoteAddress
            const fakeIp = '23.248.181.0';
            let location;
                    if(ip == '::1'){location = geoip.lookup(fakeIp)}
                    else{location = geoip.lookup(ip)}
            // Check if user has clocked in
            Attendance.findOne({user: req.user.username, clockOutStatus: 'Working'}, (err, foundAttendance)=>{
                if(foundAttendance){
                    return res.status(409).json({message: 'You are clocked in already'})
                } else{            
                        Attendance.create({
                        date: today.toDateString(),
                        clockIn: today.getHours() + ':' + today.getMinutes(),
                        user: req.user.username,
                        shift: shift,
                        seatingLocation: {
                            timezone: location.timezone,
                            city: location.city,
                            country: location.country}
                    }, (err, attendance)=>{
                        if(err){return res.status(500).json({message:err.message})}
                        else{
                            let diff = (calcTimeDiffWithoutSec(shift.startTime, attendance.clockIn)).toFixed(2)
                            if (diff <= 0 || (diff > 0 && diff <= shift.startMarginInMinutes)){
                                attendance.clockInStatus = 'Early'
                            }
                            else if(diff > 0 && diff > shift.startMarginInMinutes){
                                attendance.clockInStatus = 'Late'
                            };
                                attendance.clockInMargin = `${Math.floor(diff/60)} hours ${Math.round(diff%60)} minutes`
                                attendance.clockOutStatus = 'Working'
                                attendance.save(); 
                                User.findById(req.user._id, (err,user)=>{
                                    if(err){
                                        res.status(500).json({message: err.message})
                                    } else{
                                        org.attendance.push(attendance);
                                        org.save();
                                        user.attendance.push(attendance);
                                        user.save();
                                    }
                                })
                            return res.status(200).json({
                                employee: `${req.user.firstName} ${req.user.lastName}`,
                                event:    'Clocked in',
                                location: attendance.seatingLocation,
                                status:   attendance.clockInStatus,
                                margin:   attendance.clockInMargin,
                                token:    attendance.token
                            })
                       }
                    })
                }
            })
                }
            })
                }
            })
           } 
        else{
            return res.status(401).json({message: 'You need to be logged in to do that!'})
        }
       
    } 
// Clockout User
// @body:token
// Access: logged in employee
// POST
export const clockOut = (req,res)=>{
    if(req.user){
        User.findById(req.user._id, (err,user)=>{
            if(err){return res.status(404).json({message: 'no User found'})}
            else{
    Shift.findById(req.params.shift_id, (err,shift)=>{
        if(err){
            return res.status(500).json({message: err.message})
        } else if(!shift){
            return res.status(401).json({message: 'Reference error; shift not found'})
        } else{
            const closeTime = new Date();
                        Attendance.findOne({token:req.body.token}, (err, attendance)=>{
                        if(err){return res.status(500).json({message:err.message})}
                        else if(!attendance){return res.status(404).json({message: 'Attendance not found'})}
                        else if(attendance.user !== user.username){
                            return res.status(401).json({type: 'Unauthorized',message: 'You are not authorized to do that'})
                        }
                        else if(attendance.clockOutStatus !== 'Working'){
                            return res.status(409).json({message: 'You are already clocked out for this shift'})
                        }
                        else{
                            attendance.clockOut = closeTime.getHours() + ':' + closeTime.getMinutes();
                            let diff = (calcTimeDiffWithoutSec(shift.endTime, attendance.clockOut)).toFixed(2)
                            if (diff <= 0 || (diff > 0 && diff <= shift.endMarginInMinutes)){
                                attendance.clockOutStatus = 'Early'
                            }
                            else if(diff > 0 || diff > shift.endMarginInMinutes){
                                attendance.clockOutStatus = 'Overtime'
                            };
                                attendance.clockOutMargin = `${Math.floor(diff/60)} hours ${Math.round(diff%60)} minutes`
                                attendance.save(); 
                                user.save();
                                return res.status(200).json({
                                employee: `${req.user.firstName} ${req.user.lastName}`,
                                event: 'Clocked Out',
                                status: attendance.clockOutStatus,
                                margin: attendance.clockOutMargin,
                                
                            })
                        }
                    })
                }
            })
        }
    })

        } else{
            return res.status(401).json({message: 'You need to be logged in to do that'})
        }
    }

    const fetchAttendance = (req,res, user,startDate,endDate)=>{
        // getEach date from  start date till end date
                let lastDate = new Date(endDate);
                var getDateArray = (start, end)=> {  
                var arr = new Array();
                var dt = new Date(start);
                while (dt <= end) {
                    arr.push(new Date(dt).toDateString());
                    dt.setDate(dt.getDate() + 1);
                }
                return arr
            }
        var dateArr = getDateArray(startDate, lastDate);
       // Fetch attendance for each date for this employee from start date till end date
        Attendance.find({user:user}, (err,records)=>{
            var recordArr = [];
        if(err){return res.status(500).json({message: err.message})} 
        else if(!records || records == undefined || records.length == 0){
        return res.status(200).json({message: 'No attendance records found'})
            }
         else{  
        dateArr.forEach((date)=>{
        for(var i=0; i<=records.length; i++){
        if(date == records[i].date){
            recordArr.push({
                date: records[i].date,
                status: records[i].clockInStatus,
                arrival: records[i].clockIn
            })
            break;
        } 
        if(date !== records[i].date){
            recordArr.push({
                date,
                status: 'Absent'
            })
            break;
        }
    }
    })  } 
        return res.status(200).json({recordArr})
        })  
    }   
  
        // fetchMyAttendance
        // GET
        // Access: logged in employee
    export const fetchMyAttendance = (req,res)=>{
        if(req.user){
            var begin =  new Date(req.query.startDate).toDateString()
            var end = new Date(req.query.endDate).toDateString()
          fetchAttendance(req,res, req.user.username,begin, end);
            } else{
                return res.status(401).json({message: 'You need to be logged in to do that'})
            }
        }



 // fetchUserAttendance
 // GET
 // Access: logged in admin
     export const fetchThisUserAttendance = (req,res)=>{
     User.findOne({username:req.params.user}, (err,user)=>{
         if(err){return res.status(500).json({message: err.message})} 
                else if(!user){return res.status(404).json({message: 'User not found'})} 
                else if(user){
                    var begin =  new Date(req.query.startDate).toDateString()
                    var end = new Date(req.query.endDate).toDateString()
                    fetchAttendance(req,res,user.username,begin, end)
                        }
 
                else{
                    return res.status(401).json({message: 'You need to be logged in to do that'})
                }
            })}


// fetchAttendanceForUsers
// Access: Logged in admin
// GET
// query: user
export const fetchManyUsersAttendance = (req,res)=>{
    var begin =  new Date(req.query.startDate).toDateString()
    var endT = new Date(req.query.endDate).toDateString()
        var getDateArray = (start, end)=> {  
    var arr = new Array();
    var dt = new Date(start);
    while (dt <= new Date(end)) {
        arr.push(new Date(dt).toDateString());
        dt.setDate(dt.getDate() + 1);
    }
     return arr
    }
    var dateArr = getDateArray(begin, endT);
    const users = req.query.user;
    var allRecords = [];
    var list = [];
    for(var i=0; i<=users.length; i++){
        list.push({user: users[i]})
    }
        Attendance.find({$or: list}).sort({user: 'asc'}).exec((err, records)=>{
       if(err){
           return res.status(500).json({message: err.message})
        } else if(!records || records == undefined || records.length == 0){
            return res.status(404).json({message: 'No attendance records found for these users'})
        } else if(records){
            dateArr.forEach((date)=>{
                for(var i=0; i<=records.length; i++){
                 if(date == records[i].date){
                     allRecords.push({
                         employee: records[i].user,
                         date: records[i].date,
                         status: records[i].clockInStatus,
                         arrival: records[i].clockIn
                     })
                    //  break;
                 } 
                 if(date !== records[i].date){
                     allRecords.push({
                        employee: records[i].user,
                         date,
                         status: 'Absent'
                     })
                     break;
                 }
        }
    })
    return res.status(200).json({allRecords})
      }
    })}

// fetchOrganizationWideAttendance
// Access: Logged in admin
// GET
// params: organization_Name
export const fetchAllAttendance = (req,res)=>{
    if(req.user){
    Organization.findOne({urlname:req.params.urlname}, (err,org)=>{
        if(err){return res.status(500).json({message: err.message})}
        else if(!org){return res.status(404).json({message: 'Organization not found'})}
        else if(!org.admin.includes(req.user._id)){
            return res.status(401).json({message: 'You are not authorized to do this'})
        }
        else{
    var begin =  new Date(req.query.startDate).toDateString()
    var endT = new Date(req.query.endDate).toDateString()
    var getDateArray = (start, end)=> {  
    var arr = new Array();
    var dt = new Date(start);
    while (dt <= new Date(end)) {
        arr.push(new Date(dt).toDateString());
        dt.setDate(dt.getDate() + 1);
    }
     return arr
    }
    var dateArr = getDateArray(begin, endT);
    var allRecords = [];
    var list = [];
    User.find({affiliatedOrg:org}, (err,users)=>{
        if(err) return res.status(500).json({message:err.message})
        else if(!users) return res.status(404).json({message: 'No users found in this org'})
        else {
    for(var i=0; i<users.length; i++){
        list.push({user: users[i].username})
    }
        Attendance.find({$or: list}).sort({user: 'asc'}).exec((err, records)=>{
       if(err){
           return res.status(500).json({message: err.message})
        } else if(!records || records == undefined || records.length == 0){
            return res.status(404).json({message: 'No attendance records found for these users'})
        } else if(records){
            dateArr.forEach((date)=>{
                for(var i=0; i<=records.length; i++){
                 if(date == records[i].date){
                     allRecords.push({
                         employee: records[i].user,
                         date: records[i].date,
                         status: records[i].clockInStatus,
                         arrival: records[i].clockIn
                     })
                    //  break;
                 } 
                 if(date !== records[i].date){
                     allRecords.push({
                        employee: records[i].user,
                         date,
                         status: 'Absent'
                     })
                     break;
                 }
        }
    })               
}
})
    return res.status(200).json({allRecords})
      }
    })
}
})
} else{
    return res.status(401).json({message: 'You need to be logged in to that'})
}
} 

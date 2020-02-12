import {Attendance} from '../models/Attendance';
import {Shift} from '../models/Shift';
import {Organization} from '../models/Organization';
import {Location} from '../models/Location'
import { calcTimeDiff, fetchUserAttendance } from '../middlewares/attendanceCalc';
import { User } from '../models/User';
const geoip = require ('geoip-lite');

// Clock in user
// @POST
// Access: logged in employee
// @body: :shiftId
export const clockIn = (req,res)=>{
    if(req.user){
     Shift.findById(req.body.shiftId, (err,shift)=>{
        if(err){
            return res.status(500).json({message: err.message})
        } else if(!shift){
            return res.status(404).json({message: 'Reference error; shift not found'})
        } else{
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
                        clockIn: today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds(),
                        user: req.user.username,
                        shift: shift,
                        seatingLocation: {
                            timezone: location.timezone,
                            city: location.city,
                            country: location.country}
                    }, (err, attendance)=>{
                        if(err){return res.status(500).json({message:err.message})}
                        else{
                            let diff = (calcTimeDiff(shift.startTime, attendance.clockIn)).toFixed(2)
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

        } else{
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
    Shift.findById(req.body.shiftId, (err,shift)=>{
        if(err){
            return res.status(500).json({message: err.message})
        } else if(!shift){
            return res.status(404).json({message: 'Reference error; shift not found'})
        } else{
            const closeTime = new Date();
                        Attendance.findOne({token:req.body.token}, (err, attendance)=>{
                        if(err){return res.status(500).json({message:err.message})}
                        else if(!attendance){return res.status(404).json({message: 'Attendance not found'})}
                        else if(attendance.clockOutStatus !== 'Working'){
                            return res.status(409).json({message: 'You are already clocked out for this shift'})
                        }
                        else{
                            attendance.clockOut = closeTime.getHours() + ':' + closeTime.getMinutes() + ':' + closeTime.getSeconds();
                            let diff = (calcTimeDiff(shift.endTime, attendance.clockOut)).toFixed(2)
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


        // fetchMyAttendance
        // GET
        // Access: logged in employee
    export const fetchMyAttendance = (req,res)=>{
        if(req.user){
                    // getEach date from  employee's join date till date
                            let today = new Date();
                            var getDateArray = (start, end)=> {  
                            var arr = new Array();
                            var dt = new Date(start);
                            while (dt <= end) {
                                arr.push(new Date(dt).toDateString());
                                dt.setDate(dt.getDate() + 1);
                            }
                        }
                    var dateArr = getDateArray(req.user.createdAt, today);
            // Fetch attendance for each date for this employee from joinDate till today
           var arr = new Array();
             dateArr.forEach((date)=>{ 
                    Attendance.find({user: req.user.username, date}, (err,record)=>{
                    if(err){return res.status(500).json({message:err.message})}
                    else if(!record){
                        arr.push({date, attendance: 'Absent'});
                    }
                    else if(record.length == 1){
                        arr.push({
                            date, 
                            attendance: 'Present', 
                            clockIn: record.clockIn,
                            clockInStatus: record.clockInStatus,
                            clockOut: record.clockOut,
                            clockOutStatus: record.clockOutStatus,
                        })
                    }else if(record.length > 1){
                        record.forEach((rec)=>{
                            arr.push({
                            date, 
                            attendance: 'Present', 
                            clockIn: rec.clockIn,
                            clockInStatus: rec.clockInStatus,
                            clockOut: rec.clockOut,
                            clockOutStatus: rec.clockOutStatus,
                        })     
                        })  
                    }
                }) 
            })
            return res.status(200).json({attendance:arr})                        
            } else{
                return res.status(401).json({message: 'You need to be logged in to do that'})
            }
        }



// fetchOrganizationWideAttendance
// Access: Logged in admin
// GET
// params: organization_Name
const fetchOrganizationWideAttendance = (req,res)=>{
    Organization.findOne({name: req.params.orgName}, (err,org)=>{
        if(err){
            return res.status(500).json({message: err.message})
        } else if(!org){
            return res.status(404).json({message: 'Organization not found'})
        } else if(org){
                if(!req.user){
                    return res.status(401).json({meessage: 'Unauthorized access'})
                } 
                else if(org.admins.indexOf(req.user._id) == -1){
                    return res.status(401).json({message: 'Unauthorized access'})
                } else {
                    org.users.forEach((user)=>{
                        fetchUserAttendance(user)
                    })
                }
        }
    })
    
}


import {Attendance} from '../models/Attendance';
import {Shift} from '../models/Shift';
import {Location} from '../models/Location'
import { calcTimeDiff } from '../middlewares/attendanceCalc';
import { User } from '../models/User';
const geoip = require ('geoip-lite');

// Clock in user
// @POST
// Access: logged in employee
// @params: :shiftId
export const clockIn = (req,res)=>{
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
            Attendance.findOne({shift, user: req.user.username, date: today.toDateString(), clockOut: undefined}, (err, foundAttendance)=>{
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
                                event: 'Clocked in',
                                location: attendance.seatingLocation,
                                status: attendance.clockInStatus,
                                margin: attendance.clockInMargin
                            })
                        }
                    })
                }
            })
                }
            })

        }

// Clockout User
// Params: :token
// Access: logged in employee
// POST
export const clockOut = (req,res)=>{
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
                        else if(attendance.clockOut !== undefined){
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
                                return res.status(200).json({
                                employee: `${req.user.firstName} ${req.user.lastName}`,
                                event: 'Clocked Out',
                                status: attendance.clockOutStatus,
                                margin: attendance.clockOutMargin
                            })
                        }
                    })
                }
            })

        }





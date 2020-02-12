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
                    // If the attendance record is just a single record
                    else if(record.length == 1){
                        arr.push({
                            date, 
                            attendance: 'Present', 
                            clockIn: record.clockIn,
                            clockInStatus: record.clockInStatus,
                            clockOut: record.clockOut,
                            clockOutStatus: record.clockOutStatus,
                        })
                    // if the attendance record has multiple records
                    }else if(record.length > 1){
                       return record.forEach((rec)=>{
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
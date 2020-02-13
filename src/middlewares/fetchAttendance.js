import {Attendance} from '../models/Attendance';

export const fetchAttendance = (user,startDate,endDate)=>{
    // getEach date from  employee's join date till date
            let today = new Date(endDate);
            var getDateArray = (start, end)=> {  
            var arr = new Array();
            var dt = new Date(start);
            while (dt <= end) {
                arr.push(new Date(dt).toDateString());
                dt.setDate(dt.getDate() + 1);
            }
            return arr
        }
    var dateArr = getDateArray(startDate, today);
// Fetch attendance for each date for this employee from joinDate till today
    Attendance.find({user:user}, (err,records)=>{
if(err){return res.status(500).json({message: err.message})} 
else if(!records){
    return res.status(200).json({message: 'No attendance records found'})
}
else{  
var arr = [];
dateArr.forEach((date)=>{
   for(var i=0; i<=records.length; i++){
    if(date == records[i].date){
        arr.push({
            date: records[i].date,
            status: records[i].clockInStatus,
            arrival: records[i].clockIn
        })
    } 
    if(date !== records[i].date){
        arr.push({
            date,
            status: 'Absent'
        })
        break;
    }
}
})          
return arr 
}
})

}
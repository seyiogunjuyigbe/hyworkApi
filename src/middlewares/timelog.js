export const checkIfJobLogExists = (user,job)=>{
    var bolArr = [];
    user.jobLogs.forEach((log)=>{
    if(log.job_id == job._id) bolArr.push(true)
    else bolArr.push(false)
    })
    if(bolArr.includes(true)){
         console.log('Already exists');
         return user.jobLogs[bolArr.indexOf(true)].hours;
        }
    else {
        user.jobLogs.push({
            job_id:job._id,hours:0
        });
        user.save();
        
    }
    }

    export const checkIfJobLogExistsAndUpdate = (user,job,hours)=>{
        var bolArr = [];
    user.jobLogs.forEach((log)=>{
    if(log.job_id == job._id) bolArr.push(true)
    else bolArr.push(false)
    })
    if(bolArr.includes(true)){
         user.jobLogs[bolArr.indexOf(true)].hours += Number(hours).toFixed(2);
         user.save();
         
        }
    else {
        console.log('This log does not exist')
            }
    }
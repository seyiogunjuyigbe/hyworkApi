export const calcTimeDiff=(start,end)=>{
    var startStrips = stripTimeStr(start);
    var endStrips = stripTimeStr(end)
    var timeDiff;
    var hourDiff = Number(endStrips[0]) - Number(startStrips[0]);
    var minDiff = Number(endStrips[1]) - Number(startStrips[1]);
    var secDiff = Number(endStrips[2]) - Number(startStrips[2]);
    timeDiff = (hourDiff * 60) + (minDiff)+ (secDiff/60);
   return timeDiff
}
const stripTimeStr = (str)=>{
var indices = [];
var strips = []
for(var i=0; i<str.length;i++) {
    if (str[i] === ":") indices.push(i);
}
strips.push((str.substring(0,indices[0])), str.substring(indices[0]+1,indices[1]), str.substring(indices[1]+1,str.length))
return strips;
}


export const calcTimeDiffWithoutSec=(start,end)=>{
    var startStrips = stripTime(start);
    var endStrips = stripTime(end)
    var timeDiff;
    var hourDiff = Number(endStrips[0]) - Number(startStrips[0]);
    var minDiff = Number(endStrips[1]) - Number(startStrips[1]);
    timeDiff = (hourDiff * 60) + (minDiff)
   return timeDiff
}
const stripTime = (str)=>{
var indices = [];
var strips = []
for(var i=0; i<str.length;i++) {
    if (str[i] === ":") indices.push(i);
}
strips.push((str.substring(0,indices[0])), str.substring(indices[0]+1,indices[1]))
return strips;
}


export const fetchUserAttendance = (user,arr)=>{
    
}
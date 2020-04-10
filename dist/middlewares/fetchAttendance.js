"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchAttendance = undefined;

var _Attendance = require("../models/Attendance");

var fetchAttendance = exports.fetchAttendance = function fetchAttendance(user, startDate, endDate) {
  // getEach date from  employee's join date till date
  var today = new Date(endDate);

  var getDateArray = function getDateArray(start, end) {
    var arr = new Array();
    var dt = new Date(start);

    while (dt <= end) {
      arr.push(new Date(dt).toDateString());
      dt.setDate(dt.getDate() + 1);
    }

    return arr;
  };

  var dateArr = getDateArray(startDate, today); // Fetch attendance for each date for this employee from joinDate till today

  _Attendance.Attendance.find({
    user: user
  }, function (err, records) {
    if (err) {
      return res.status(500).json({
        message: err.message
      });
    } else if (!records) {
      return res.status(200).json({
        message: 'No attendance records found'
      });
    } else {
      var arr = [];
      dateArr.forEach(function (date) {
        for (var i = 0; i <= records.length; i++) {
          if (date == records[i].date) {
            arr.push({
              date: records[i].date,
              status: records[i].clockInStatus,
              arrival: records[i].clockIn
            });
          }

          if (date !== records[i].date) {
            arr.push({
              date: date,
              status: 'Absent'
            });
            break;
          }
        }
      });
      return arr;
    }
  });
};
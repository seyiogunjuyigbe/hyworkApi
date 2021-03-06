"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchManyUsersAttendance = exports.fetchThisUserAttendance = exports.fetchMyAttendance = exports.clockOut = exports.clockIn = undefined;

var _TenantModels = require("../models/TenantModels");

var _Organization = require("../models/Organization");

var _attendanceCalc = require("../middlewares/attendanceCalc");

var _User = require("../models/User");

var geoip = require('geoip-lite'); // Clock in user
// @POST
// Access: logged in employee
// @body: :shiftId


var clockIn = exports.clockIn = function clockIn(req, res) {
  if (req.user) {
    _Organization.Organization.findOne({
      urlname: req.params.urlname,
      employees: {
        $in: req.user._id
      }
    }, function (err, org) {
      if (err) {
        return res.status(500).json({
          message: err.message
        });
      } else if (!org) {
        return res.status(404).json({
          message: 'Organization not found, please join one'
        });
      } else {
        _TenantModels.Shift.findById(req.params.shift_id, function (err, shift) {
          if (err) {
            return res.status(500).json({
              message: err.message
            });
          } else if (!shift || String(shift.createdFor) !== String(org._id)) {
            return res.status(422).json({
              message: 'Reference error; shift not found'
            });
          } else {
            var today = new Date();
            var ip = (req.headers['x-forwarded-for'] || '').split(',').pop() || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
            var fakeIp = '23.248.181.0';
            var location;

            if (ip == '::1') {
              location = geoip.lookup(fakeIp);
            } else {
              location = geoip.lookup(ip);
            } // Check if user has clocked in


            _TenantModels.Attendance.findOne({
              user: req.user.username,
              clockOutStatus: 'Working'
            }, function (err, foundAttendance) {
              if (foundAttendance) {
                return res.status(409).json({
                  message: 'You are clocked in already'
                });
              } else {
                _TenantModels.Attendance.create({
                  date: today.toDateString(),
                  clockIn: today.getHours() + ':' + today.getMinutes(),
                  user: req.user.username,
                  shift: shift,
                  seatingLocation: {
                    timezone: location.timezone,
                    city: location.city,
                    country: location.country
                  }
                }, function (err, attendance) {
                  if (err) {
                    return res.status(500).json({
                      message: err.message
                    });
                  } else {
                    var diff = (0, _attendanceCalc.calcTimeDiffWithoutSec)(shift.startTime, attendance.clockIn).toFixed(2);

                    if (diff <= 0 || diff > 0 && diff <= shift.startMarginInMinutes) {
                      attendance.clockInStatus = 'Early';
                    } else if (diff > 0 && diff > shift.startMarginInMinutes) {
                      attendance.clockInStatus = 'Late';
                    }

                    ;
                    attendance.clockInMargin = "".concat(Math.floor(diff / 60), " hours ").concat(Math.round(diff % 60), " minutes");
                    attendance.clockOutStatus = 'Working';
                    attendance.save();

                    _User.User.findById(req.user._id, function (err, user) {
                      if (err) {
                        res.status(500).json({
                          message: err.message
                        });
                      } else {
                        org.attendance.push(attendance);
                        org.save();
                        user.attendance.push(attendance);
                        user.save();
                      }
                    });

                    return res.status(200).json({
                      employee: "".concat(req.user.firstName, " ").concat(req.user.lastName),
                      event: 'Clocked in',
                      location: attendance.seatingLocation,
                      status: attendance.clockInStatus,
                      margin: attendance.clockInMargin,
                      token: attendance.token
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else {
    return res.status(401).json({
      message: 'You need to be logged in to do that!'
    });
  }
}; // Clockout User
// @body:token
// Access: logged in employee
// POST


var clockOut = exports.clockOut = function clockOut(req, res) {
  if (req.user) {
    _User.User.findById(req.user._id, function (err, user) {
      if (err) {
        return res.status(404).json({
          message: 'no User found'
        });
      } else {
        _TenantModels.Shift.findById(req.params.shift_id, function (err, shift) {
          if (err) {
            return res.status(500).json({
              message: err.message
            });
          } else if (!shift) {
            return res.status(401).json({
              message: 'Reference error; shift not found'
            });
          } else {
            var closeTime = new Date();

            _TenantModels.Attendance.findOne({
              token: req.body.token
            }, function (err, attendance) {
              if (err) {
                return res.status(500).json({
                  message: err.message
                });
              } else if (!attendance) {
                return res.status(404).json({
                  message: 'Attendance not found'
                });
              } else if (attendance.user !== user.username) {
                return res.status(401).json({
                  type: 'Unauthorized',
                  message: 'You are not authorized to do that'
                });
              } else if (attendance.clockOutStatus !== 'Working') {
                return res.status(409).json({
                  message: 'You are already clocked out for this shift'
                });
              } else {
                attendance.clockOut = closeTime.getHours() + ':' + closeTime.getMinutes();
                var diff = (0, _attendanceCalc.calcTimeDiffWithoutSec)(shift.endTime, attendance.clockOut).toFixed(2);

                if (diff <= 0 || diff > 0 && diff <= shift.endMarginInMinutes) {
                  attendance.clockOutStatus = 'Early';
                } else if (diff > 0 || diff > shift.endMarginInMinutes) {
                  attendance.clockOutStatus = 'Overtime';
                }

                ;
                attendance.clockOutMargin = "".concat(Math.floor(diff / 60), " hours ").concat(Math.round(diff % 60), " minutes");
                attendance.save();
                user.save();
                return res.status(200).json({
                  employee: "".concat(req.user.firstName, " ").concat(req.user.lastName),
                  event: 'Clocked Out',
                  status: attendance.clockOutStatus,
                  margin: attendance.clockOutMargin
                });
              }
            });
          }
        });
      }
    });
  } else {
    return res.status(401).json({
      message: 'You need to be logged in to do that'
    });
  }
};

var fetchAttendance = function fetchAttendance(req, res, user, startDate, endDate) {
  // getEach date from  start date till end date
  var lastDate = new Date(endDate);

  var getDateArray = function getDateArray(start, end) {
    var arr = new Array();
    var dt = new Date(start);

    while (dt <= end) {
      arr.push(new Date(dt).toDateString());
      dt.setDate(dt.getDate() + 1);
    }

    return arr;
  };

  var dateArr = getDateArray(startDate, lastDate); // Fetch attendance for each date for this employee from start date till end date

  _TenantModels.Attendance.find({
    user: user
  }, function (err, records) {
    var recordArr = [];

    if (err) {
      return res.status(500).json({
        message: err.message
      });
    } else if (!records || records == undefined || records.length == 0) {
      return res.status(200).json({
        message: 'No attendance records found'
      });
    } else {
      dateArr.forEach(function (date) {
        for (var i = 0; i <= records.length; i++) {
          if (date == records[i].date) {
            recordArr.push({
              date: records[i].date,
              status: records[i].clockInStatus,
              arrival: records[i].clockIn
            });
            break;
          }

          if (date !== records[i].date) {
            recordArr.push({
              date: date,
              status: 'Absent'
            });
            break;
          }
        }
      });
    }

    return res.status(200).json({
      recordArr: recordArr
    });
  });
}; // fetchMyAttendance
// GET
// Access: logged in employee


var fetchMyAttendance = exports.fetchMyAttendance = function fetchMyAttendance(req, res) {
  if (req.user) {
    var begin = new Date(req.query.startDate).toDateString();
    var end = new Date(req.query.endDate).toDateString();
    fetchAttendance(req, res, req.user.username, begin, end);
  } else {
    return res.status(401).json({
      message: 'You need to be logged in to do that'
    });
  }
}; // fetchUserAttendance
// GET
// Access: logged in admin


var fetchThisUserAttendance = exports.fetchThisUserAttendance = function fetchThisUserAttendance(req, res) {
  _User.User.findOne({
    username: req.params.user
  }, function (err, user) {
    if (err) {
      return res.status(500).json({
        message: err.message
      });
    } else if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    } else if (user) {
      var begin = new Date(req.query.startDate).toDateString();
      var end = new Date(req.query.endDate).toDateString();
      fetchAttendance(req, res, user.username, begin, end);
    } else {
      return res.status(401).json({
        message: 'You need to be logged in to do that'
      });
    }
  });
}; // fetchAttendanceForUsers
// Access: Logged in admin
// GET
// query: user


var fetchManyUsersAttendance = exports.fetchManyUsersAttendance = function fetchManyUsersAttendance(req, res) {
  var begin = new Date(req.query.startDate).toDateString();
  var endT = new Date(req.query.endDate).toDateString();

  var getDateArray = function getDateArray(start, end) {
    var arr = new Array();
    var dt = new Date(start);

    while (dt <= new Date(end)) {
      arr.push(new Date(dt).toDateString());
      dt.setDate(dt.getDate() + 1);
    }

    return arr;
  };

  var users = req.query.user;
  var list = [];

  for (var i = 0; i <= users.length; i++) {
    list.push({
      user: users[i]
    });
  }

  _TenantModels.Attendance.find({
    $or: list
  }).sort({
    user: 'asc'
  }).exec(function (err, records) {
    if (err) {
      return res.status(500).json({
        message: err.message
      });
    } else if (!records || records == undefined || records.length == 0) {
      return res.status(404).json({
        message: 'No attendance records found for these users'
      });
    } else if (records) {
      var allRecords = [];
      var dateArr = getDateArray(begin, endT);
      console.log(dateArr);

      for (var i = 0; i < dateArr.length; i++) {
        for (var i = 0; i < records.length; i++) {
          if (dateArr[i] == records[i].date) {
            allRecords.push({
              employee: records[i].user,
              date: records[i].date,
              status: records[i].clockInStatus,
              arrival: records[i].clockIn
            }); //                 //  break;
          } else if (dateArr[i] !== records[i].date) {
            allRecords.push({
              employee: records[i].user,
              date: dateArr[i],
              status: 'Absent'
            }); //  break;
          }
        }
      }

      return res.status(200).json({
        allRecords: allRecords
      });
    }
  });
};
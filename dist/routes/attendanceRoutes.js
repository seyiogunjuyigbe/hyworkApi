"use strict";

var _attendance = require("../controllers/attendance");

var express = require('express');

var router = express.Router();
router.post('/:urlname/attendance/:shift_id/clockin', _attendance.clockIn);
router.post('/:urlname/attendance/:shift_id/clockout', _attendance.clockOut);
router.get('/:urlname/attendance/fetch/me', _attendance.fetchMyAttendance);
router.get('/:urlname/attendance/fetch/user/:user', _attendance.fetchThisUserAttendance);
router.get('/:urlname/attendance/fetch/many', _attendance.fetchManyUsersAttendance);
module.exports = router;
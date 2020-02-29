const express = require('express');
import {clockIn, clockOut, fetchMyAttendance, fetchManyUsersAttendance, fetchThisUserAttendance, fetchAllAttendance} from '../controllers/attendance';
const router = express.Router();
router.post('/:urlname/attendance/:shift_id/clockin', clockIn)        
router.post('/:urlname/attendance/:shift_id/clockout', clockOut);
router.get('/:urlname/attendance/fetch/me', fetchMyAttendance)
router.get('/:urlname/attendance/fetch/user/:user', fetchThisUserAttendance)
router.get('/:urlname/attendance/fetch/many', fetchManyUsersAttendance)
router.get('/:urlname/attendance/fetch/all', fetchAllAttendance)


module.exports = router;
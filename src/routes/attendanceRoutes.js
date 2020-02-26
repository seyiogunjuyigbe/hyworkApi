const express = require('express');
import {clockIn, clockOut, fetchMyAttendance, fetchManyUsersAttendance, fetchThisUserAttendance, fetchAllAttendance} from '../controllers/attendance';
const router = express.Router();
router.post('/clockin', clockIn)        
router.post('/clockout', clockOut);
router.get('/attendance', fetchMyAttendance)
router.get('/attendance/:user', fetchThisUserAttendance)
router.get('/attendance/fetch/many', fetchManyUsersAttendance)
router.get('/attendance/fetch/all', fetchAllAttendance)


module.exports = router;
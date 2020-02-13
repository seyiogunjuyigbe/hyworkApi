const express = require('express');
import {clockIn, clockOut, fetchMyAttendance, fetchManyUserAttendance, fetchThisUserAttendance} from '../controllers/attendance';
const router = express.Router();
router.post('/clockin', clockIn)        
router.post('/clockout', clockOut);
router.get('/attendance', fetchMyAttendance)
router.get('/attendance/:user', fetchThisUserAttendance)
router.get('/attendance/fetch/many', fetchManyUserAttendance)

module.exports = router;
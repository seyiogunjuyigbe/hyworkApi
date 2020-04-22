const express = require('express');
const router = express.Router();
import {createLeaveRequest, approveLeave, declineLeave, fetchApprovedLeaveRequests,
    fetchDeclinedLeaveRequests,fetchLeaveRecordsByDept,fetchLeaveRecordsForUser, 
    fetchMyLeaveRecords,fetchPendingLeaveRequests} from '../controllers/leave';
import { check,sanitize } from 'express-validator';
router.post('/:urlname/d/:deptId/leave/new', [
    check('title').not().isEmpty().withMessage('Leave has to have a title'),
    check('reason').not().isEmpty().withMessage('Leave has to have a reason')],  createLeaveRequest);
router.get('/:urlname/d/:deptId/leave/:token/approve', approveLeave);
router.get('/:urlname/d/:deptId/leave/:token/decline', declineLeave);
router.get('/:urlname/d/:deptId/leaves/fetch/all', fetchLeaveRecordsByDept);
router.get('/:urlname/d/:deptId/leaves/fetch?username=', fetchLeaveRecordsForUser);
router.get('/:urlname/d/:deptId/leaves/fetch/me', fetchMyLeaveRecords);
router.get('/:urlname/d/:deptId/leaves/fetch/approved', fetchApprovedLeaveRequests);
router.get('/:urlname/d/:deptId/leaves/fetch/declined', fetchDeclinedLeaveRequests);
router.get('/:urlname/d/:deptId/leaves/fetch/pending', fetchPendingLeaveRequests);






module.exports  = router;

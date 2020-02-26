const express = require('express');
const router = express.Router();
import {createLeaveRequest, approveLeave, declineLeave} from '../controllers/leaveController';
router.post('/:urlname/d/:deptId/leave/new', createLeaveRequest);
router.get('/:urlname/d/:deptId/leave/:token/approve', approveLeave);
router.get('/:urlname/d/:deptId/leave/:token/decline', declineLeave)
module.exports  = router;

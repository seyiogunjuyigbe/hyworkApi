const express = require('express');
const router = express.Router();
import {createLeaveRequest, approveLeave, declineLeave} from '../controllers/leaveController';
router.post('/new', createLeaveRequest);
router.post('/:token/approve', approveLeave);
router.post('/:token/decline', declineLeave)
module.exports  = router;
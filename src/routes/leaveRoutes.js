const express = require('express');
const router = express.Router();
import {createLeaveRequest, approveLeave, declineLeave} from '../controllers/leave';
import { check,sanitize } from 'express-validator';
router.post('/:urlname/d/:deptId/leave/new', [
    check('title').not().isEmpty().withMessage('Leave has to have a title'),
    check('reason').not().isEmpty().withMessage('Leave has to have a reason')],  createLeaveRequest);
router.get('/:urlname/d/:deptId/leave/:token/approve', approveLeave);
router.get('/:urlname/d/:deptId/leave/:token/decline', declineLeave)
module.exports  = router;

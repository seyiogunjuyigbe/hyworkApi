"use strict";

var _leave = require("../controllers/leave");

var _expressValidator = require("express-validator");

var express = require('express');

var router = express.Router();
router.post('/:urlname/d/:deptId/leave/new', [(0, _expressValidator.check)('title').not().isEmpty().withMessage('Leave has to have a title'), (0, _expressValidator.check)('reason').not().isEmpty().withMessage('Leave has to have a reason')], _leave.createLeaveRequest);
router.get('/:urlname/d/:deptId/leave/:token/approve', _leave.approveLeave);
router.get('/:urlname/d/:deptId/leave/:token/decline', _leave.declineLeave);
module.exports = router;
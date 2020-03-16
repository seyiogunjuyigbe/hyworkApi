"use strict";

var _express = require("express");

var _shift = require("../controllers/shift");

var _require = require('express-validator'),
    check = _require.check;

var validate = require("../middlewares/validate");

var authUser = require('../middlewares/middleware');

var orgMiddleware = require('../middlewares/organization');

var router = (0, _express.Router)(); // For one reason or the other req.params becomes invisible to the req object when these routes are refactored 
// with app.use(/org/:urlname/shifts), so I brought them here as a fix.

router.post('/:urlname/shifts/new', [check('title').not().isEmpty().withMessage('Please give a title to this shift'), check('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).not().isEmpty().withMessage('Shift has to have a start time in the format HH:MM'), check('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).not().isEmpty().withMessage('Shift has to have a end time in the format HH:MM')], validate, _shift.createShift);
router.post('/:urlname/shifts/:shift_id/update', [check('title').not().isEmpty().withMessage('Please give a title to this shift'), check('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).not().isEmpty().withMessage('Shift has to have a start time in the format HH:MM'), check('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).not().isEmpty().withMessage('Shift has to have a end time in the format HH:MM')], validate, _shift.updateShift);
router.get('/:urlname/shifts/fetch/all', _shift.fetchShifts);
router.get('/:urlname/shifts/:shift_id/delete', _shift.deleteShift);
module.exports = router;
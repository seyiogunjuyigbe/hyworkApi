import { Router } from "express";
import { createShift, updateShift, fetchShifts, deleteShift } from "../controllers/shift";
const { check } = require('express-validator');
const validate = require("../middlewares/validate");
const authUser = require('../middlewares/middleware');
const orgMiddleware = require('../middlewares/organization');
const router = Router();

// For one reason or the other req.params becomes invisible to the req object when these routes are refactored 
// with app.use(/org/:urlname/shifts), so I brought them here as a fix.
router.post('/:urlname/shifts/new', [
    check('title').not().isEmpty().withMessage('Please give a title to this shift'),
    check('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).not().isEmpty().withMessage('Shift has to have a start time in the format HH:MM'),
    check('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).not().isEmpty().withMessage('Shift has to have a end time in the format HH:MM')], validate, createShift)
router.post('/:urlname/shifts/:shift_id/update', [
        check('title').not().isEmpty().withMessage('Please give a title to this shift'),
        check('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).not().isEmpty().withMessage('Shift has to have a start time in the format HH:MM'),
        check('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).not().isEmpty().withMessage('Shift has to have a end time in the format HH:MM')], validate, updateShift)
router.get('/:urlname/shifts/fetch/all', fetchShifts);
router.get('/:urlname/shifts/:shift_id/delete', deleteShift);

module.exports = router;

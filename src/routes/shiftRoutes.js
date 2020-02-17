import { Router } from "express";
import { createShift, updateShift, fetchShifts, deleteShift } from "../controllers/shift";

const { check } = require('express-validator');
const validate = require("../middlewares/validate");
const router = Router();

router.get('/new', [
    check('title').isEmpty().withMessage('Please give a title to this shift'),
    check('startTime').isEmpty().withMessage('Shift has to have a start time'),
    check('endTime').isEmpty().withMessage('Shift has to have a end time')], validate, createShift)
router.post('/shift/shift_id',[
    check('title').isEmpty().withMessage('Please give a title to this shift'),
    check('startTime').isEmpty().withMessage('Shift has to have a start time'),
    check('endTime').isEmpty().withMessage('Shift has to have a end time')], validate, updateShift);
router.get('/all', fetchShifts);
router.get('/shift/:shift_id', deleteShift);

module.exports = router;

import { Router } from "express";
import { createShift, updateShift, fetchShifts, deleteShift } from "../controllers/shift";

const { check } = require('express-validator');
const validate = require("../middlewares/validate");
const authUser = require('../middlewares/middleware');
const orgMiddleware = require('../middlewares/organization');
const router = Router();

router.get('/new', [
    check('title').isEmpty().withMessage('Please give a title to this shift'),
    check('startTime').isEmpty().withMessage('Shift has to have a start time'),
    check('endTime').isEmpty().withMessage('Shift has to have a end time')], [ validate, authUser.authUser, orgMiddleware.LoggedUserisEmployee ], createShift)
router.post('/shift/shift_id',[
    check('title').isEmpty().withMessage('Please give a title to this shift'),
    check('startTime').isEmpty().withMessage('Shift has to have a start time'),
    check('endTime').isEmpty().withMessage('Shift has to have a end time')], [ validate, authUser.authUser, orgMiddleware.LoggedUserisEmployee ], updateShift);
router.get('/all', [ authUser.authUser, orgMiddleware.LoggedUserisAdmin], fetchShifts);
router.get('/shift/:shift_id', [authUser.authUser], deleteShift);

module.exports = router;

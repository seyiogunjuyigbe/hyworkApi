import { Router } from "express";
import {addRating,createAppraisalCycle,addUsersToAppraisal,calculateUserRating}  from "../controllers/rating";

const { check } = require('express-validator');
const validate = require("../middlewares/validate");
const {isAdmin,orgExists,authUser} = require('../middlewares/middleware');
const router = Router({mergeParams: true})
router.post('/:urlname/appraisal/new',authUser,orgExists, isAdmin,[
    check('title').not().isEmpty().withMessage('Title is required'),
    check('startDate').not().isEmpty().withMessage('Start Date is required'),
    check('endDate').not().isEmpty().withMessage('End Date is required'),
    check('process_period_start').not().isEmpty().withMessage('Process Start Date is required'),
    check('process_period_end').not().isEmpty().withMessage('Process End Date is required'),
    check('assessor_selector').isIn(['manager','any']).not().isEmpty().withMessage('Choose assessor selector (manager, any)'),
    check('no_of_assessors').not().isEmpty().withMessage('No of assessors is required'),
    check('review_period_start').not().isEmpty().withMessage('Review Start Date is required'),
    check('review_period_end').not().isEmpty().withMessage('Review End Date is required'),
], validate, createAppraisalCycle);
router.post('/:urlname/appraisal/:token/adduser',authUser,orgExists, isAdmin,
[
     check('employees').isArray({min:1}).withMessage('Employees cannot be empty and must be an array of ids')
],validate,addUsersToAppraisal)
router.post('/:urlname/appraisal/:token/rate', authUser,orgExists,
[
    check('employee_id').not().isEmpty().withMessage('Employee ID is required'),
    check('value').not().isEmpty().withMessage('Rating value is required'),
], validate, addRating)
module.exports = router;
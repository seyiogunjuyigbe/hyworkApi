import { Router } from "express";
import {addRating,createAppraisalCycle,addUsersToAppraisal,calculateUserRating,createKra, addWeightageToKRA, editKRA, deleteKRA,
    tagDeptToKRA,tagEmployeeToKRA,tagRoleToKRA
}  from "../controllers/rating";

const { check } = require('express-validator');
const validate = require("../middlewares/validate");
const {orgExists,authUser} = require('../middlewares/middleware');
const {LoggedUserisAdmin} = require ('../middlewares/organization')
const router = Router({mergeParams: true})
router.post('/:urlname/appraisal/new',authUser,orgExists, LoggedUserisAdmin,[
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
router.post('/:urlname/appraisal/:token/adduser',authUser,orgExists, LoggedUserisAdmin,
[
     check('employees').isArray({min:1}).withMessage('Employees cannot be empty and must be an array of ids')
],validate,addUsersToAppraisal)
router.post('/:urlname/appraisal/:token/rate', authUser,orgExists,
[
    check('employee_id').not().isEmpty().withMessage('Employee ID is required'),
    check('value').not().isEmpty().withMessage('Rating value is required'),
    check('type').isIn(['Feedback', 'KRA']).withMessage('Rating type is required (Feedback or KRA)'),
    check('max_value').not().isEmpty().withMessage('Rating max value is required')
    
], validate, addRating)
router.get('/:urlname/appraisal/:token/rating/:type/fetch/:employee_id',
orgExists,authUser,LoggedUserisAdmin,calculateUserRating);
router.post('/:urlname/kra/create', authUser, orgExists, LoggedUserisAdmin, [
    check('title').not().isEmpty().withMessage('Title cannot be empty'), 
    check('description').not().isEmpty().withMessage('Description cannot be empty'), ], validate,createKra);
router.post('/:urlname/kra/:token/add-weightage', authUser,orgExists,LoggedUserisAdmin,
    check('weightage').not().isEmpty().withMessage('Weightage cannot be empty'), validate,addWeightageToKRA);
router.post('/:urlname/kra/:token/update', authUser,orgExists,LoggedUserisAdmin,
[
    check('title').not().isEmpty().withMessage('Title cannot be empty'), 
    check('description').not().isEmpty().withMessage('Description cannot be empty'), 
    check('weightage').not().isEmpty().withMessage('Weightage cannot be empty'),],
     validate,editKRA);
router.get('/:urlname/kra/:token/delete', authUser,orgExists,LoggedUserisAdmin,deleteKRA);
router.get('/:urlname/kra/:token/tag/employee/:employee_id', authUser,orgExists,LoggedUserisAdmin,tagEmployeeToKRA);
router.get('/:urlname/kra/:token/tag/role/:role_id', authUser,orgExists,LoggedUserisAdmin,tagRoleToKRA);
router.get('/:urlname/kra/:token/tag/dept/:dept_id', authUser,orgExists,LoggedUserisAdmin,tagDeptToKRA);

module.exports = router;
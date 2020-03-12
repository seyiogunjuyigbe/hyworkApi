const router = require ('express').Router();
import { createJob,fetchThisJob, assignThisJob } from "../controllers/job";
import { LoggedUserisEmployee, LoggedUserisAdmin } from "../middlewares/organization";
import { check } from "express-validator";
import { authUser } from "../middlewares/middleware";
const validate = require('../middlewares/validate')
router.post('/:urlname/job/new', authUser, LoggedUserisEmployee,LoggedUserisAdmin, [
    check('title').not().isEmpty().withMessage('Please give this job a title'),
    check('hours').isNumeric().not().isEmpty().withMessage('Please specify number of hours for this job')
], validate, createJob)
router.post('/:urlname/job/:job_id/assign', authUser, LoggedUserisEmployee,LoggedUserisAdmin, [
    check('assignees').isArray().not().isEmpty().withMessage('Please assign this job to an employee')
], validate, assignThisJob)

router.get('/:urlname/job/:job_id/view', authUser,LoggedUserisEmployee,fetchThisJob)
module.exports = router;
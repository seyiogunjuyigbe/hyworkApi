const router = require ('express').Router();
import { createJob,fetchThisJob, assignThisJob, updateThisJob, createProject,addJobToProject } from "../controllers/job";
import { LoggedUserisEmployee, LoggedUserisAdmin } from "../middlewares/organization";
import { check } from "express-validator";
import { authUser } from "../middlewares/middleware";
import { startTimeLogForThisJob,endTimeLogForThisJob, fetchMyLogsForThisJob, 
    fetchUsersLogsForThisJob,submitTimesheetForThisJob,approveTimesheetForThisJob, fetchTimesheetForThisJob,
    rejectTimesheetForThisJob } from "../controllers/timelog";
const validate = require('../middlewares/validate');
router.post('/:urlname/project/new', authUser, LoggedUserisEmployee, [
    check('title').not().isEmpty().withMessage('Please give this project a title'),
    check('description').not().isEmpty().withMessage('Please give description to project')
], validate,createProject)
router.post('/:urlname/job/new', authUser, LoggedUserisEmployee, [
    check('title').not().isEmpty().withMessage('Please give this job a title'),
    check('hours').isNumeric().not().isEmpty().withMessage('Please specify number of hours for this job')
], validate, createJob);

router.post('/:urlname/job/:job_id/assign', authUser, LoggedUserisEmployee, [
    check('assignees').isArray().not().isEmpty().withMessage('Please assign this job to an employee')
], validate, assignThisJob);

router.post('/:urlname/job/:job_id/update', authUser, LoggedUserisEmployee, [
    check('title').not().isEmpty().withMessage('Please give this job a title'),
    check('hours').isNumeric().not().isEmpty().withMessage('Please specify number of hours for this job')
], validate, updateThisJob);

router.get('/:urlname/job/:job_id/view', authUser,LoggedUserisEmployee,fetchThisJob);

router.post('/:urlname/job/:job_id/log/new', authUser,LoggedUserisEmployee, [
    check('description').not().isEmpty().withMessage('You need to mention what you worked on'),
    check('startTime').not().isEmpty().withMessage('Please specify a start time for this log')
], startTimeLogForThisJob);

router.post('/:urlname/job/:job_id/log/:token/end', authUser,LoggedUserisEmployee, [
    check('endTime').not().isEmpty().withMessage('Please specify the end time for this log')
], endTimeLogForThisJob);
router.get('/:urlname/project/:project_id/job/add/:job_id', authUser,LoggedUserisEmployee, addJobToProject)
router.get('/:urlname/job/:job_id/logs/fetch/me', authUser,LoggedUserisEmployee,fetchMyLogsForThisJob);
router.get('/:urlname/job/:job_id/logs/fetch/many', authUser,LoggedUserisEmployee, fetchUsersLogsForThisJob);
router.post('/:urlname/job/:job_id/logs/submit', authUser, submitTimesheetForThisJob);
router.get('/:urlname/job/:job_id/logs/sheet/:sheet_id/fetch', authUser, fetchTimesheetForThisJob),
router.get('/:urlname/job/:job_id/logs/sheet/:sheet_id/approve', authUser,LoggedUserisAdmin, approveTimesheetForThisJob)
router.get('/:urlname/job/:job_id/logs/sheet/:sheet_id/reject', authUser,LoggedUserisAdmin, rejectTimesheetForThisJob)
module.exports = router;
const router = require('express').Router();
const authUser = require("../middlewares/middleware");
const orgMiddleware = require("../middlewares/organization");
const { check } = require('express-validator');
const validate = require("../middlewares/validate");
import { createTask, addFiletoTask, getTasksAssignedToUser, getTasksAssignedByMe, getFilesAssignedToTask, addDeadlineToTask, extendDeadlineToTask } from '../controllers/task';


router.get('/:urlname/task/assignedto/:username',[ authUser.authUser, orgMiddleware.orgExists ,orgMiddleware.LoggedUserisEmployee ], getTasksAssignedToUser )
router.post('/:urlname/task/:id/add/file/:fileId', [ authUser.authUser, authUser.orgExists ], addFiletoTask);
router.post('/:urlname/task/add/:username', [
    check("title").not().isEmpty().withMessage("Enter Task title"),
    check("description").not().isEmpty().withMessage("Enter Task description")], [ validate, authUser.authUser, authUser.orgExists ], createTask)
router.get('/task/:id/files', getFilesAssignedToTask );
router.post('/task/:id/addDeadline', addDeadlineToTask );



module.exports = router;
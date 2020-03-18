"use strict";

var _task = require("../controllers/task");

var router = require('express').Router();

var authUser = require("../middlewares/middleware");

var orgMiddleware = require("../middlewares/organization");

var _require = require('express-validator'),
    check = _require.check;

var validate = require("../middlewares/validate");

router.get('/:urlname/task/assignedto/:username', [authUser.authUser, orgMiddleware.orgExists, orgMiddleware.LoggedUserisEmployee], _task.getTasksAssignedToUser);
router.post('/:urlname/task/:id/add/file/:fileId', [authUser.authUser, authUser.orgExists], _task.addFiletoTask);
router.post('/:urlname/task/add/:username', [check("title").not().isEmpty().withMessage("Enter Task title"), check("description").not().isEmpty().withMessage("Enter Task description")], [validate, authUser.authUser, authUser.orgExists], _task.createTask);
router.get('/task/:id/files', _task.getFilesAssignedToTask);
router.post('/task/:id/addDeadline', _task.addDeadlineToTask);
module.exports = router;
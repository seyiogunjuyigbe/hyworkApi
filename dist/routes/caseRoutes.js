"use strict";

var _case = require("../controllers/case");

var _middleware = require("../middlewares/middleware");

var _organization = require("../middlewares/organization");

var router = require('express').Router();

var validate = require('../middlewares/validate');

var _require = require('express-validator'),
    check = _require.check;

router.post('/:urlname/case/new', [check('title').isString().not().isEmpty().withMessage().withMessage('Please give this case a title'), check('category').isString().not().isEmpty().withMessage().withMessage('Please give this case a category'), check('description').isString().not().isEmpty().withMessage().withMessage('Please give this case a description'), check('respondents').isArray().not().isEmpty().withMessage().withMessage('Please give this case a minimum of 1 respondent')], validate, _middleware.authUser, _organization.LoggedUserisEmployee, _case.createCase);
router.post('/:urlname/case/:case_id/comment/new', check('notes').not().isEmpty().withMessage('Your comment can not be empty'), validate, _middleware.authUser, _organization.LoggedUserisEmployee, _case.respondToCase);
router.get('/:urlname/case/:case_id/view', _middleware.authUser, _organization.LoggedUserisEmployee, _case.fethThiscase);
router.post('/:urlname/case/:case_id/status/change', check('status').not().isEmpty().withMessage('Please specify new case status'), validate, _middleware.authUser, _organization.LoggedUserisEmployee, _case.changeCaseStatus);
router.post('/:urlname/case/:case_id/respondents/new', check('newRespondents').isArray().not().isEmpty().withMessage('Please specify a minimum of 1 new respondent'), validate, _middleware.authUser, _organization.LoggedUserisEmployee, _case.inviteRespondentToCase);
module.exports = router;
const router = require('express').Router();
import {createCase, respondToCase, fethThiscase, changeCaseStatus,inviteRespondentToCase, getAllCases} from '../controllers/case';
const validate = require('../middlewares/validate');
const { check } = require('express-validator');
import {authUser} from '../middlewares/middleware';
import {LoggedUserisEmployee} from '../middlewares/organization'

router.post('/:urlname/case/new', [
    check('title').isString().not().isEmpty().withMessage().withMessage('Please give this case a title'),
    check('category').isString().not().isEmpty().withMessage().withMessage('Please give this case a category'),
    check('description').isString().not().isEmpty().withMessage().withMessage('Please give this case a description'),
    check('respondents').isArray().not().isEmpty().withMessage().withMessage('Please give this case a minimum of 1 respondent'),

], validate, authUser, LoggedUserisEmployee, createCase);

router.post('/:urlname/case/:case_id/comment/new', check('notes').not().isEmpty().withMessage('Your comment can not be empty'),
             validate, authUser,LoggedUserisEmployee,respondToCase)

router.get('/:urlname/case/:case_id/view', authUser,LoggedUserisEmployee,fethThiscase);
router.post('/:urlname/case/:case_id/status/change',
            check('status').not().isEmpty().withMessage('Please specify new case status'),validate,
            authUser,LoggedUserisEmployee,changeCaseStatus);
router.post('/:urlname/case/:case_id/respondents/new',
            check('newRespondents').isArray().not().isEmpty().withMessage('Please specify a minimum of 1 new respondent'),validate,
            authUser,LoggedUserisEmployee,inviteRespondentToCase);
router.get('/:urlname/case/fetch/all', getAllCases);
module.exports = router;
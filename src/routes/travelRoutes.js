const router = require('express').Router();
import {createTravelRecord, updateTravelRecord, approveTravelRequest, declineTravelRequest} from '../controllers/travel'
import {check} from 'express-validator';
const validate = require('../middlewares/validate')
import {authUser} from '../middlewares/middleware';
import {LoggedUserisEmployee,LoggedUserisAdmin} from '../middlewares/organization'


router.post('/:urlname/travel/new',[
    check('purpose').isString().not().isEmpty().withMessage('Please give this travel a purpose'),
    check('placeOfVisit').isString().not().isEmpty().withMessage('Please enter a place of Visit'),
    check('departureDate').not().isEmpty().withMessage('Departure date can not be empty'),
    check('arrivalDate').not().isEmpty().withMessage('Arrival date can not be empty'),
    check('requestor').not().isEmpty().withMessage('This travel request has no requestor')

], validate, authUser, LoggedUserisEmployee,createTravelRecord)
router.post('/:urlname/travel/:travel_id/update',[
    check('purpose').isString().not().isEmpty().withMessage('Please give this travel a purpose'),
    check('placeOfVisit').isString().not().isEmpty().withMessage('Please enter a place of Visit'),
    check('departureDate').not().isEmpty().withMessage('Departure date can not be empty'),
    check('arrivalDate').not().isEmpty().withMessage('Arrival date can not be empty'),
    check('requestor').not().isEmpty().withMessage('This travel request has no requestor')

], validate, authUser, LoggedUserisEmployee,updateTravelRecord);
router.get('/:urlname/travel/:travel_id/approve', authUser, LoggedUserisEmployee, approveTravelRequest)
router.get('/:urlname/travel/:travel_id/decline', authUser, LoggedUserisEmployee, declineTravelRequest)

module.exports = router;
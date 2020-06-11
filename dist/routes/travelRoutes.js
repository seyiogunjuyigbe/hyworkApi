"use strict";

var _travel = require("../controllers/travel");

var _expressValidator = require("express-validator");

var _middleware = require("../middlewares/middleware");

var _organization = require("../middlewares/organization");

var router = require('express').Router();

var validate = require('../middlewares/validate');

router.post('/:urlname/travel/new', [(0, _expressValidator.check)('purpose').isString().not().isEmpty().withMessage('Please give this travel a purpose'), (0, _expressValidator.check)('placeOfVisit').isString().not().isEmpty().withMessage('Please enter a place of Visit'), (0, _expressValidator.check)('departureDate').not().isEmpty().withMessage('Departure date can not be empty'), (0, _expressValidator.check)('arrivalDate').not().isEmpty().withMessage('Arrival date can not be empty'), (0, _expressValidator.check)('requestor').not().isEmpty().withMessage('This travel request has no requestor')], validate, _middleware.authUser, _organization.LoggedUserisEmployee, _travel.createTravelRecord);
router.post('/:urlname/travel/:travel_id/update', [(0, _expressValidator.check)('purpose').isString().not().isEmpty().withMessage('Please give this travel a purpose'), (0, _expressValidator.check)('placeOfVisit').isString().not().isEmpty().withMessage('Please enter a place of Visit'), (0, _expressValidator.check)('departureDate').not().isEmpty().withMessage('Departure date can not be empty'), (0, _expressValidator.check)('arrivalDate').not().isEmpty().withMessage('Arrival date can not be empty'), (0, _expressValidator.check)('requestor').not().isEmpty().withMessage('This travel request has no requestor')], validate, _middleware.authUser, _organization.LoggedUserisEmployee, _travel.updateTravelRecord);
router.get('/:urlname/travel/:travel_id/approve', _middleware.authUser, _organization.LoggedUserisEmployee, _travel.approveTravelRequest);
router.get('/:urlname/travel/:travel_id/decline', _middleware.authUser, _organization.LoggedUserisEmployee, _travel.declineTravelRequest);
module.exports = router;
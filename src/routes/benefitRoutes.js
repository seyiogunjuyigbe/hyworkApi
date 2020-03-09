const router = require('express').Router();
const authUser = require("../middlewares/middleware");
const { check } = require('express-validator');
const validate = require("../middlewares/validate");
import { createBenefit, giveUserBenefit, removeBenefitFromUser, getAllBenefits } from '../controllers/benefits';

router.post('/new',[
    check("title").not().isEmpty().withMessage("Enter Benefit Title"),
    check("description").not().isEmpty().withMessage("Enter Benefit Description"),
    check("value").isFLoat().withMessage("Enter a Float Number")
], [ validate, authUser.authUser ], createBenefit);
router.get('/all', getAllBenefits );
router.post('/:id/user/:username', giveUserBenefit );
router.get('/:id/user/:username', removeBenefitFromUser );
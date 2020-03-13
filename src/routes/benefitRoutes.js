const router = require('express').Router();
const authUser = require("../middlewares/middleware");
const { check } = require('express-validator');
const validate = require("../middlewares/validate");
import { createBenefit, giveUserBenefit, removeBenefitFromUser, getAllBenefits } from '../controllers/benefits';

router.post('/:urlname/benefit/new',[
    check("title").not().isEmpty().withMessage("Enter Benefit Title"),
    check("description").not().isEmpty().withMessage("Enter Benefit Description"),
    check("value").isNumeric().withMessage("Enter a Float Number")
], [ validate ], createBenefit);
router.get('/:urlname/benefit/all', getAllBenefits );
router.post('/:urlname/benefit/:id/user/:username', giveUserBenefit );
router.get('/:urlname/benefit/:id/user/:username', removeBenefitFromUser );

module.exports = router;
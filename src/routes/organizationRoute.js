import { Router } from "express";
import controllers , { createOrganization } from "../controllers/organizationController";

const { check } = require('express-validator');
const validate = require("../middlewares/validate");

const router = Router();


router.post('/', [
    check("name").not().isEmpty().withMessage("Enter Organisation's name"),
    check("description").not().isEmpty().withMessage("Enter desctiption of organization")
], validate, createOrganization);

router.get('/:id', controllers.getOneById);
router.put('/:id', [
    check("name").not().isEmpty().withMessage("Enter Organisation's name"),
    check("description").not().isEmpty().withMessage("Enter desctiption of organization")
], validate, controllers.updateOne);




module.exports = router;
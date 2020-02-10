import { Router } from "express";
import controllers , { createOrganization, addUserToOrganization } from "../controllers/organizationController";

const { check } = require('express-validator');
const validate = require("../middlewares/validate");

const router = Router();


router.post('/', [
    check("name").not().isEmpty().withMessage("Enter Organisation's name"),
    check("description").not().isEmpty().withMessage("Enter description of organization"),
    check("urlname").not().isEmpty().withMessage("Enter url of organisation")
], validate, createOrganization);

// router.get('/:id', controllers.getOneById);
// router.put('/:id', [
//     check("name").not().isEmpty().withMessage("Enter Organisation's name"),
//     check("description").not().isEmpty().withMessage("Enter desctiption of organization")
// ], validate, controllers.updateOne);
// router.post('/:id/addUser', [
//     check("email").isEmail().withMessage('Enter a valid email address'),
//     check('firstName').not().isEmpty().withMessage(`Enter employee's first name`),
//     check('lastName').not().isEmpty().withMessage(`Enter employee's last name`)
// ], validate, addUserToOrganization );




module.exports = router;
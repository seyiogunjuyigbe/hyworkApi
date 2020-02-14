import { Router } from "express";
import { createOrganization, addUserToOrganization, fetchOrganization, updateOrganization, deleteOrganization, verifyEmployee, fetchEmployeeData } from "../controllers/organization";

const { check } = require('express-validator');
const validate = require("../middlewares/validate");
const authUser = require('../middlewares/middleware');

const router = Router();

// Create an organization
router.post('/', [
    check("name").not().isEmpty().withMessage("Enter Organisation's name"),
    check("description").not().isEmpty().withMessage("Enter description of organization"),
    check("urlname").not().isEmpty().withMessage("Enter url of Organization")
], [validate, authUser.authUser], createOrganization);
// Fetch an organization by the Url
router.get('/:urlname', fetchOrganization);
// Delete an organization
router.delete('/:urlname/delete', deleteOrganization);
//Update an Organization
router.put('/:urlname/edit', [
    check("name").not().isEmpty().withMessage("Enter Organisation's name"),
    check("description").not().isEmpty().withMessage("Enter desctiption of organization"),
    check("urlname").not().isEmpty().withMessage("Enter Url of Organization")
], validate, updateOrganization);

//Add a new user to an organization
router.post('/:urlname/addUser', [
    check("email").isEmail().withMessage('Enter a valid email address'),
    check('firstName').not().isEmpty().withMessage(`Enter employee's first name`),
    check('lastName').not().isEmpty().withMessage(`Enter employee's last name`)
], validate, addUserToOrganization );

//Verify added employee
router.get('/:urlname/user/:token', verifyEmployee);

//Fetch employee data
router.get('/:urlname/employee/:username', fetchEmployeeData);




module.exports = router;
import { Router } from "express";
import {renderCreateOrgPage,fetchMyProfile, createOrganization, addUserToOrganization, 
        fetchOrganization, updateOrganization, deleteOrganization, verifyEmployee, fetchEmployeeData, 
        checkIfOrgExists,renderPasswordPageForUser , createPasswordForUser,  
        orgLoginUser, orgLoginCb, orgLogoutUser}  from "../controllers/organization";

const { check } = require('express-validator');
const validate = require("../middlewares/validate");
const authUser = require('../middlewares/middleware');
const orgMiddleware = require('../middlewares/organization');

const router = Router({mergeParams: true});

// render page to add new organization
router.get('/', renderCreateOrgPage)

// Create an organization
router.post('/', [
    check("name").not().isEmpty().withMessage("Enter Organisation's name"),
    check("description").not().isEmpty().withMessage("Enter description of organization"),
    check("urlname").not().isEmpty().withMessage("Enter url of Organization")
], [validate, authUser.authUser], createOrganization);
// Fetch an organization by the Url
router.get('/:urlname', [authUser.authUser, orgMiddleware.LoggedUserisAdmin], fetchOrganization);
// Delete an organization
router.delete('/:urlname/delete', [authUser.authUser, orgMiddleware.LoggedUserisAdmin], deleteOrganization);
//Update an Organization
router.put('/:urlname/edit', [
    check("name").not().isEmpty().withMessage("Enter Organisation's name"),
    check("description").not().isEmpty().withMessage("Enter desctiption of organization"),
    check("urlname").not().isEmpty().withMessage("Enter Url of Organization")
], [ validate, authUser.authUser, orgMiddleware.LoggedUserisAdmin ], updateOrganization);

//Add a new user to an organization
router.post('/:urlname/user/onboard/new', [
    check("email").isEmail().not().isEmpty().withMessage('Enter a valid email address'),
    check('firstName').not().isEmpty().withMessage(`Enter employee's first name`),
    check('lastName').not().isEmpty().withMessage(`Enter employee's last name`),
    check('username').not().isEmpty().withMessage(`Enter employee's unique username`)
], [validate, authUser.authUser, orgMiddleware.LoggedUserisAdmin], addUserToOrganization );

//Verify added employee
router.get('/:urlname/user/:token', verifyEmployee);
// Create password for verified employee
router.get('/:urlname/user/:token/onboard', renderPasswordPageForUser)
router.post('/:urlname/user/:token/onboard',[
    check('username').not().isEmpty().withMessage('Username cannot be empty'),
    check('token').not().isEmpty().withMessage('Pease supply the token for this reuest'),
    check('password').not().isEmpty().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i").withMessage('Password must be at least 8 characters long and must include one lowercase character, one uppercase character, a number, and a special character'),
], validate, createPasswordForUser)
//Fetch employee data
router.get('/:urlname/employee/:username', [authUser.authUser, orgMiddleware.LoggedUserisAdmin], fetchEmployeeData);
// Check if org exists
router.get('/check/:urlname', checkIfOrgExists)
router.post("/:urlname/auth/login", [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').not().isEmpty().withMessage('Please enter the password for this account'),
], orgLoginUser,orgLoginCb);
router.get('/:urlname/auth/logout', orgLogoutUser)
router.get("/:urlname/profile/me", fetchMyProfile)


module.exports = router;
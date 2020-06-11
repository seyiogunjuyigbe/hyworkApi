"use strict";

var _express = require("express");

var _organization = require("../controllers/organization");

var _require = require('express-validator'),
    check = _require.check;

var validate = require("../middlewares/validate");

var authUser = require('../middlewares/middleware');

var orgMiddleware = require('../middlewares/organization');

var router = (0, _express.Router)({
  mergeParams: true
}); // render page to add new organization

router.get('/', _organization.renderCreateOrgPage); // Create an organization

router.post('/', [check("name").not().isEmpty().withMessage("Enter Organisation's name"), check("description").not().isEmpty().withMessage("Enter description of organization"), check("urlname").not().isEmpty().withMessage("Enter url of Organization")], [validate, authUser.authUser], _organization.createOrganization); // Fetch an organization by the Url

router.get('/:urlname', [authUser.authUser, orgMiddleware.LoggedUserisAdmin], _organization.fetchOrganization); // Delete an organization

router["delete"]('/:urlname/delete', [authUser.authUser, orgMiddleware.LoggedUserisAdmin], _organization.deleteOrganization); //Update an Organization

router.put('/:urlname/edit', [check("name").not().isEmpty().withMessage("Enter Organisation's name"), check("description").not().isEmpty().withMessage("Enter desctiption of organization"), check("urlname").not().isEmpty().withMessage("Enter Url of Organization")], [validate, authUser.authUser, orgMiddleware.LoggedUserisAdmin], _organization.updateOrganization); //Add a new user to an organization

router.post('/:urlname/user/onboard/new', [check("email").isEmail().not().isEmpty().withMessage('Enter a valid email address'), check('firstName').not().isEmpty().withMessage("Enter employee's first name"), check('lastName').not().isEmpty().withMessage("Enter employee's last name"), check('username').not().isEmpty().withMessage("Enter employee's unique username")], [validate, authUser.authUser, orgMiddleware.LoggedUserisAdmin], _organization.addUserToOrganization); //Verify added employee

router.get('/:urlname/user/:token', _organization.verifyEmployee); // Create password for verified employee

router.get('/:urlname/user/:token/onboard', _organization.renderPasswordPageForUser);
router.post('/:urlname/user/:token/onboard', [check('username').not().isEmpty().withMessage('Username cannot be empty'), check('token').not().isEmpty().withMessage('Pease supply the token for this reuest'), check('password').not().isEmpty().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i").withMessage('Password must be at least 8 characters long and must include one lowercase character, one uppercase character, a number, and a special character')], validate, _organization.createPasswordForUser); //Fetch employee data

router.get('/:urlname/employee/:username', [authUser.authUser, orgMiddleware.LoggedUserisAdmin], _organization.fetchEmployeeData); // Check if org exists

router.get('/check/:urlname', _organization.checkIfOrgExists);
router.post("/:urlname/auth/login", [check('email').isEmail().withMessage('Enter a valid email address'), check('password').not().isEmpty().withMessage('Please enter the password for this account')], _organization.orgLoginUser, _organization.orgLoginCb);
router.get('/:urlname/auth/logout', _organization.orgLogoutUser);
router.get("/:urlname/profile/me", _organization.fetchMyProfile);
module.exports = router;
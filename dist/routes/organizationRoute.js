"use strict";

var _express = require("express");

var _organization = require("../controllers/organization");

var _require = require('express-validator'),
    check = _require.check;

var validate = require("../middlewares/validate");

var authUser = require('../middlewares/middleware');

var orgMiddleware = require('../middlewares/organization');

var router = (0, _express.Router)(); // render page to add new organization

router.get('/new', _organization.renderCreateOrgPage); // Create an organization

router.post('/new', [check("name").not().isEmpty().withMessage("Enter Organisation's name"), check("description").not().isEmpty().withMessage("Enter description of organization"), check("urlname").not().isEmpty().withMessage("Enter url of Organization")], [validate, authUser.authUser], _organization.createOrganization); // Fetch an organization by the Url

router.get('/:urlname', [authUser.authUser, orgMiddleware.LoggedUserisAdmin], _organization.fetchOrganization); // Delete an organization

router["delete"]('/:urlname/delete', [authUser.authUser, orgMiddleware.LoggedUserisAdmin], _organization.deleteOrganization); //Update an Organization

router.put('/:urlname/edit', [check("name").not().isEmpty().withMessage("Enter Organisation's name"), check("description").not().isEmpty().withMessage("Enter desctiption of organization"), check("urlname").not().isEmpty().withMessage("Enter Url of Organization")], [validate, authUser.authUser, orgMiddleware.LoggedUserisAdmin], _organization.updateOrganization); //Add a new user to an organization

router.post('/:urlname/addUser', [check("email").isEmail().withMessage('Enter a valid email address'), check('firstName').not().isEmpty().withMessage("Enter employee's first name"), check('lastName').not().isEmpty().withMessage("Enter employee's last name")], [validate, authUser.authUser, orgMiddleware.LoggedUserisAdmin], _organization.addUserToOrganization); //Verify added employee

router.get('/:urlname/user/:token', _organization.verifyEmployee); //Fetch employee data

router.get('/:urlname/employee/:username', [authUser.authUser, orgMiddleware.LoggedUserisAdmin], _organization.fetchEmployeeData); // Check if org exists

router.get('/check/:urlname', _organization.checkIfOrgExists);
module.exports = router;
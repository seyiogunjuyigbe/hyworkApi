"use strict";

var _department = require("../controllers/department");

var _department2 = _interopRequireDefault(_department);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = require('express').Router();

var authUser = require("../middlewares/middleware");

var _require = require('express-validator'),
    check = _require.check;

var validate = require("../middlewares/validate");

router.post('/:urlname/dept/create', [check("title").not().isEmpty().withMessage("Enter title of Department"), check("description").not().isEmpty().withMessage("Enter description of Department")], [validate, authUser.orgExists], _department.createDepartment);
router.post('/:urlname/dept/:id/add', [authUser.authUser, authUser.isAdmin, authUser.orgExists], _department.addDeptToOrg);
router["delete"]('/:urlname/dept/:id/remove', [authUser.orgExists], _department.removeOne);
router.post('/:urlname/dept/:id/addManager/:username', [authUser.authUser, authUser.isAdmin, authUser.orgExists], _department.addManager);
router.post('/:urlname/dept/:id/addEmployee/:username', _department.addEmployee);
router.post('/:urlname/dept/:id/removeEmployee/:username', _department.removeEmployee);
module.exports = router;
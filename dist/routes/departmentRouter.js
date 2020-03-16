"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _department = _interopRequireWildcard(require("../controllers/department"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var router = require('express').Router();

var authUser = require("../middlewares/middleware");

var _require = require('express-validator'),
    check = _require.check;

var validate = require("../middlewares/validate");

router.post('/:urlname/dept/create', [check("title").not().isEmpty().withMessage("Enter title of Department"), check("description").not().isEmpty().withMessage("Enter description of Department")], [validate, authUser.orgExists], _department.createDepartment);
router.post('/:urlname/dept/:id/add', [authUser.authUser, authUser.isAdmin, authUser.orgExists], _department.addDeptToOrg);
router["delete"]('/:urlname/dept/:id/remove', [authUser.orgExists], _department["default"].removeOne);
router.post('/:urlname/dept/:id/addManager/:username', [authUser.authUser, authUser.isAdmin, authUser.orgExists], _department.addManager);
router.post('/:urlname/dept/:id/addEmployee/:username', _department.addEmployee);
router.post('/:urlname/dept/:id/removeEmployee/:username', _department.removeEmployee);
module.exports = router;
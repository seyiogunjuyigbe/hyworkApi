const router = require('express').Router();
import crudControllers, { createDepartment, addDeptToOrg, getAllDepartments, addEmployee, addManager, removeOne, removeEmployee} from '../controllers/department';
const authUser = require("../middlewares/middleware");
const { check } = require('express-validator');
const validate = require("../middlewares/validate");



router.post('/:urlname/dept/create', [
    check("title").not().isEmpty().withMessage("Enter title of Department"),
    check("description").not().isEmpty().withMessage("Enter description of Department")
], [validate, authUser.orgExists], createDepartment);

router.post('/:urlname/dept/:id/add', [authUser.authUser, authUser.isAdmin, authUser.orgExists], addDeptToOrg);
router.delete('/:urlname/dept/:id/remove', [ authUser.orgExists], removeOne);
router.post('/:urlname/dept/:id/addManager/:username', [authUser.authUser, authUser.isAdmin, authUser.orgExists], addManager);
router.get('/:urlname/dept/all', getAllDepartments );

router.post('/:urlname/dept/:id/addEmployee/:username', addEmployee);
router.post('/:urlname/dept/:id/removeEmployee/:username', removeEmployee);

module.exports = router;
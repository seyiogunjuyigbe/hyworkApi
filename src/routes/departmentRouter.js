const router = require('express').Router();
import { createDepartment, addDeptToOrg, addEmployee, addManager} from '../controllers/department';
const authUser = require("../middlewares/middleware");
const { check } = require('express-validator');
const validate = require("../middlewares/validate");



router.post('/:urlname/dept/create', [
    check("title").not().isEmpty().withMessage("Enter title of Department"),
    check("description").not().isEmpty().withMessage("Enter description of Department")
], [validate, authUser.orgExists], createDepartment);

router.post('/:urlname/dept/:title/add', [authUser.orgExists], addDeptToOrg);
router.post('/:urlname/dept/:title/addManager/:username', [authUser.isAdmin], addManager);

router.post('/:urlname/dept/:title/addEmployee/:username', addEmployee);

module.exports = router;
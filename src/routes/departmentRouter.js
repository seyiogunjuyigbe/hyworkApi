const router = require('express').Router();
import { createDepartment, addDeptToOrg, addEmployee, addManager} from '../controllers/department';
const authUser = require("../middlewares/middleware");
const { check } = require('express-validator');


router.post('/department/create', [
    check("title").not().isEmpty().withMessage("Enter title of Department"),
    check("description").not().isEmpty().withMessage("Enter description of Department")
], [authUser.authUser], createDepartment);

router.post('/department/:title/add', [authUser.authUser], addDeptToOrg);
router.post('/department/:title/addManager/:username', [authUser.authUser], addManager);

router.post('/department/:title/addEmployee/:username', [authUser.authUser], addEmployee);

module.exports = router;
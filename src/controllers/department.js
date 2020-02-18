import { Organization } from "../models/Organization";
import { Department } from "../models/Department";
import { User } from "../models/User";
import { crudControllers } from "../../utils/crud";
const response = require("../middlewares/response");

//Route: org/:urlname/department/create
export const createDepartment = async (req, res) => {
    const { title, description } = req.body;
    console.log(title);
    try {
        const org = Organization.findOne({ urlname: req.params.urlname });
        Department.create({ title, description, dateCreated: Date.now() }, (err, dept) => {
            if (err) {
                response.error(res, 404, err)
            }
            console.log(dept._id);
            org.department.push(dept._id);
            org.save();
            response.success(res, 200, `Added department ${dept.title} to organization ${org.name}`);

        });
    } catch (error) {
        response.error(res, 500, error.message)
    }
}

//Route: org/:urlname/department/:title/addManager/:username
export const addManager = async (req, res) => {
    const { title, username } = req.params;

    try {
        const org = await Organization.findOne({ urlname: req.params.urlname });
        Department.findOne({ title }, (err, dept) => {
            if (err) {
                response.error(res, 404, err);
            }
            User.findOne({ username }, (err, user) => {
                if (err) {
                    response.error(res, 404, err)
                }
                dept.manager = user._id;
                dept.save((err) => {
                    if (err) {
                        response.error(err)
                    }
                    response.success(res, 200, `Made User ${user.username} the manager of department ${dept.title}`)
                })
            })
        });
    } catch (error) {
        response.error(res, 500, error.message)
    }
}
//Route: org/:urlname/department/:title/addEmployee/:username
export const addEmployee = async (req, res) => {
    const { title, username } = req.params;

    try {
        const org = await Organization.findOne({ urlname: req.params.urlname });
        Department.findOne({ title }, (err, dept) => {
            if (err) {
                response.error(res, 404, err);
            }
            User.findOne({ username }, (err, user) => {
                if (err) {
                    response.error(res, 404, err)
                }
                if(dept.employees.includes(user._id)) {
                    response.error(res, 500, `Employee ${user.username} is already a member of department ${dept.name}`)
                }
                dept.employees.push(user._id);
                dept.save();
                response.success(res, 200, `Added ${user.username} to department ${dept.title}`);

            })
        });
    } catch (error) {
        response.error(res, 500, error.message)
    }
}

// Route: /organization/:urlname/department/:title/add
export const addDeptToOrg = async (req, res) => {
    const { title, urlname } = req.params;
    // console.log(title);
    try {
        const org = await Organization.findOne({ urlname });
        Department.findOne({ title }, (err, dept) => {
            if (err) {
                response.error(res, 404, err);
            }
            if (org.department.includes(dept._id)) {
                response.error(res, 404, `Department ${dept.title} already exists in organization ${org.name}`)
            }
            org.department.push(dept._id);
            org.save();
            response.success(res, 200, `Added department ${dept.title} to organization ${org.name}`);
        });
    } catch (error) {
        response.error(res, 500, error.message)
    }
}

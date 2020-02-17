import { Organization } from "../models/Organization";
import { Department } from "../models/Department";
import { crudControllers } from "../../utils/crud";
const response = require("../middlewares/response");


export const createDepartment = async (req, res) => {
    const { title, description } = req.body;
    try {
        const org = await Organization.findOne({ urlname: req.params.urlname});
        if (org) {
            Department.create({ title, description, dateCreated: Date.now() }, (err, dept) => {
                if(err) {
                    response.error(res, 404, err)
                }
                org.department.push(dept._id);
                org.save((err) => {
                    if(err) {
                        response.error(res, 500, err);
                    }
                    response.success(res, 200, `Added department ${dept.title} to organization ${org.name}`);
                })

            })

        }

    }catch(error) {
        response.error(res, 500, error.message)
    }
}
const response = require("../middlewares/response");


//Route: org/:urlname/department/create
export const createDepartment = async (req, res) => {
    const { title, description } = req.body;
    const { Department, TenantOrganization } = req.dbModels;
    try {
        const org = await TenantOrganization.findOne({ urlname: req.params.urlname });
        Department.create({ title, description, dateCreated: Date.now() }, (err, dept) => {
            if (err) {
                response.error(res, 404, err)
            }
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
    const { Department, TenantOrganization, User } = req.dbModels;
    const { id, username } = req.params;

    try {
        const org = await TenantOrganization.findOne({ urlname: req.params.urlname });
        Department.findById(id, (err, dept) => {
            if (err) {
                response.error(res, 404, err);
            }
            User.findOne({ username }, (err, user) => {
                if (err) {
                    response.error(res, 404, err)
                }
                if (org.department.includes(dept._id)) {
                    dept.manager = user._id;
                    dept.save()
                    response.success(res, 200, `Made User ${user.username} the manager of department ${dept.title}`)
                } else {
                    response.error(res, 404, `Department ${dept.title} not a department in organization ${org.name}`)
                }
            })
        });
    } catch (error) {
        response.error(res, 500, error.message)
    }
}
//Route: org/:urlname/department/:title/addEmployee/:username
export const addEmployee = async (req, res) => {
    const { Department, TenantOrganization, User } = req.dbModels;
    const { id, username } = req.params;

    try {
        const org = await TenantOrganization.findOne({ urlname: req.params.urlname });
        Department.findById(id, (err, dept) => {
            if (err) {
                response.error(res, 404, err);
            }
            User.findOne({ username }, (err, user) => {
                if (err) {
                    return response.error(res, 404, err)
                }
                if (dept.employees.includes(user._id)) {
                    return response.error(res, 500, `${user.firstName} ${user.lastName} is already a member of department ${dept.title}`)
                }
                dept.employees.push(user._id);
                dept.save();
                return response.success(res, 200, `Added ${user.firstName} to department ${dept.title}`);

            })
        });
    } catch (error) {
        return response.error(res, 500, error.message)
    }
}


//Remove employee from department
export const removeEmployee = async (req, res) => {
    const { Department, TenantOrganization, User } = req.dbModels;
    const { id, username } = req.params;

    try {
        const org = await TenantOrganization.findOne({ urlname: req.params.urlname });
        Department.findById(id, (err, dept) => {
            if (err) {
                response.error(res, 404, err);
            }
            if (org.department.includes(dept._id)) {

                User.findOne({ username }, (err, user) => {
                    if (err) {
                        return response.error(res, 404, err)
                    }
                    if (dept.employees.includes(user._id)) {
                        dept.employees = dept.employees.filter(value => {
                            value === user._id
                        });
                        dept.save();
                        return response.success(res, 200, `Removed ${user.firstName} from department ${dept.title}`);
                    } else {
                        return response.error(res, 404, `${user.firstName} is not a member of this department`)
                    }
                })

            } else {
                response.error(res, 404, `Department ${dept.title} not a department in organization ${org.name}`);
            }
        });
    } catch (error) {
        return response.error(res, 500, error.message)
    }
}
// Route: /organization/:urlname/department/:title/add
export const addDeptToOrg = async (req, res) => {
    const { Department, TenantOrganization, User } = req.dbModels;
    const { id, urlname } = req.params;
    try {
        const org = await TenantOrganization.findOne({ urlname });
        Department.findById(id, (err, dept) => {
            if (err) {
                return response.error(res, 404, err);
            }
            if (org.department.includes(dept._id)) {
                return response.error(res, 404, `Department ${dept.title} already exists in organization ${org.name}`)
            }
            org.department.push(dept._id);
            org.save();
            return response.success(res, 200, `Added department ${dept.title} to organization ${org.name}`);
        });
    } catch (error) {
        return response.error(res, 500, error.message)
    }
}


export const removeOne = async (req, res) => {
    try {
        const { Department } = req.dbModels;
        const removed = await Department.findOneAndRemove({
            _id: req.params.id
        });

        if (!removed) {
            return res.status(400).end();
        }
        return res.status(200).json({ data: removed });
    } catch (error) {
        console.error(error);
        res.status(400).end();
    }
};

export const getAllDepartments = (req, res) => {
    const { Department } = req.dbModels;
    Department.find({}, (err, dept) => {
        if (err) { response.error(res, 404, 'Could not fetch benefits') };
        response.success(res, 200, dept);
    });
}
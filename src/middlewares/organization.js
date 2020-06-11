import { Organization } from "../models/Organization";
import { User } from "../models/User";
const response = require("../middlewares/response");

export const orgExists = (req, res, next) => {
    const { urlname } = req.params;
    Organization.findOne({ urlname }, (err, org) => {
        if (org) {
            return next()
        } else {
            response.error(res, 404, `Organization could not be found`)
        }
    })
}

export const LoggedUserisEmployee = async (req, res, next) => {
    const { urlname } = req.params;
    const { TenantOrganization } = req.dbModels;
    TenantOrganization.findOne({ urlname }, (err, org) => {
        if (err) response.error(res, 500, err.message);
        else if (!org) response.error(res, 404, `Organization ${urlname} not found`)
        else if (org.employees.includes(req.user._id)) {
            return next()
        } else {
            response.error(res, 403, `${req.user.firstName} is not an employee of ${org.name}`)
        }
    })
}

export const LoggedUserisAdmin = async (req, res, next) => {
    const { urlname } = req.params;

    Organization.findOne({ urlname }, (err, org) => {
        if (err) response.error(res, 500, err.message);
        else if (!org) response.error(res, 404, 'This organization does not exist')
        else if (org.admin.includes(req.user._id)) {
            return next()
        } else {
            response.error(res, 403, `${req.user.firstName} is not an admin
             of ${org.name}`)
        }
    })
}

export const checkDBExists = (req, res, next) => {
    Organization.findOne({ urlname: req.headers.host.toLowerCase() }, (err, org) => {
        if (org) {
            next()
        }
    });
}
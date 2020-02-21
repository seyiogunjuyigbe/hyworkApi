import { Organization } from "../models/Organization";
import { User } from "../models/User";
const response = require("../middlewares/response");

export const orgExists = (req, res, next) => {
    const { urlname } = req.params;
    Organization.findOne({ urlname }, (err, org) => {
        if(org) {
            return next()
        }else {
            response.error(res, 404, `Organization could not be found`)
        }
    })
}

export const LoggedUserisEmployee = async (req, res, next) => {
    const { urlname } = req.params;
    
    Organization.findOne({ urlname }, (err, org) => {
        if(org.employees.includes(req.user._id)) {
            return next()
        }else {
            response.error(res, 404, `${req.user.firstName} is not an employee of ${org.name}`)
        }
    })
} 

export const LoggedUserisAdmin = async (req, res, next) => {
    const { urlname } = req.params;
    
    Organization.findOne({ urlname }, (err, org) => {
        if(org.admin.includes(req.user._id)) {
            return next()
        }else {
            response.error(res, 404, `${req.user.firstName} is not an admin
             of ${org.name}`)
        }
    })
} 
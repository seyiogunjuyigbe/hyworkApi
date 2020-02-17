import { Organization } from "../models/Organization";
const response = require("../middlewares/response");

export const checkUrlExists = url => {
    Organization.find({ urlname: url }, (err, org) => {
        if (!org.name === undefined) {
            console.log()
            return true
        }
        else {
            return false
        }
    })
}

export const authUser = (req, res, next) => {
    if(req.user) {
        return next();
    }else {
        response.error(res, 404, 'User is not logged in')
    }
}

export const isAdmin = (req, res, next) => {
    if(req.user.role === "admin") {
        return next();
    }else {
        response.error(res, 404, 'User does not have the required permission')
    }
}

export const orgExists = (req, res, next) => {
    Organization.findOne({urlname: req.params.urlname}, (err, org) => {
        if(org) {
            return next()
        }else {
            response.error(res, 404, `Organization could not be found`)
        }
    })
}
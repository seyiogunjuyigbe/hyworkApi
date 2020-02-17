import { Organization } from "../models/Organization";
const response = require("../middlewares/response");

export const checkUrlExists = url => {
    Organization.find({ urlname: url }, (err, org) => {
        if (!org[0].name === undefined) {
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
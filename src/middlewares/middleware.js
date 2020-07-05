import { Organization } from "../models/Organization";
const response = require("../middlewares/response");

export const checkUrlExists = url => {
    Organization.find({ urlname: url }, (err, org) => {
        if (!org.name === undefined) {
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
        return res.redirect('/auth/login?redirect='+req.originalUrl)
    }
}

export const isAdmin = (req, res, next) => {
    if(req.user.role === "admin") {
        return next();
    }else {
        return res.status(403).render('error/403', {message: 'You are unauthorized to do this'})
    }
}

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

export const getDIfferenceinDays = (start,end)=>{
   var diffInMilliSecs = new Date(end) - new Date(start)
   return (diffInMilliSecs/(8.64e+7))
}

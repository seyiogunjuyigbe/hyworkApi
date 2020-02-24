import {User} from '../models/User';
import {Organization} from '../models/Organization';
import {Leave} from '../models/Leave';
const hardResponse = require('../middlewares/hardResponse')

export const createLeaveRequest = (req,res)=>{
    // check if user is logged in
    if(!req.user){
        
    } else{

    }
    // fetch Organization
    // fetch user
    // check if user belongs to org
    // CREATE LEAVE request
}
export const checkNow = (req,res)=>{
    if(req.user){
       hardResponse.success(res,200)
    } else{
        hardResponse.error(res,401)
    }
}
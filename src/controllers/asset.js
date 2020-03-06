import {Asset} from '../models/Asset';
import {Organization} from '../models/Organization';
import {User} from '../models/User'
const response = require('../middlewares/response')

// Assign a company asset to an employee and create records for it
// @POST /org/:urlame/asset/new
// Access: loggde in admin
// req.body:  title, description, acquiredBy, dateAcquired,dateReleased
export const createAsset = (req,res)=>{
Organization.findOne({urlname:req.params.urlname}).populate("employees", "username -_id")
    .then((org)=>{
        console.log(org)
        if(!org.employees.includes(req.body.acquiredBy)) return response.error(res,422,'This employee does not exist')
        else{
            User.findOne({username:req.body.acquiredBy}, (err,user)=>{
                if(err) return response.error(res,500,err.message)
                else if(!user) return response.error(res,404, 'User does not exist')
                else {
                 Asset.create({...req.body,createdBy:req.user.username},(err,asset)=>{
                if(err) return response.error(res,500,err.message)
                else{
                    asset.save();
                    user.assets.push(asset);
                    user.save();
                    org.assets.push(assset);
                    org.save()
                }
            })
        }})
        }
    })
    .catch((err)=>{
        response.error(res,500,err.message)
    })
}
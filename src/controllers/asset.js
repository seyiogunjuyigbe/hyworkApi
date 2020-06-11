import { Asset } from '../models/Asset';
import { Organization } from '../models/Organization';
import { User } from '../models/User'
const response = require('../middlewares/response')

// Assign a company asset to an employee and create records for it
// @POST /org/:urlame/asset/new
// Access: loggde in admin
// req.body:  title, type, description, acquiredBy, dateAcquired,dateReleased
export const createAsset = (req, res) => {
    const { Asset, TenantOrganization, User } = req.dbModels;
    TenantOrganization.findOne({ urlname: req.params.urlname }).populate("employees", "username -_id")
        .then((org) => {
            var list = [];
            org.employees.forEach(employee => list.push(employee.username))
            if (!list.includes(req.body.acquiredBy)) {
                console.log(list)
                return response.error(res, 422, 'This employee does not exist')
            }
            else if ((new Date(req.body.dateAcquired)).getTime() >= (new Date(req.body.dateReleased)).getTime()) {
                return response.error(res, 422, 'Release date must be later than acquired date')
            }
            else {
                User.findOne({ username: req.body.acquiredBy }, (err, user) => {
                    if (err) return response.error(res, 500, err.message)
                    else if (!user) return response.error(res, 404, 'User does not exist')
                    else {
                        Asset.create({ ...req.body, createdBy: req.user.username }, (err, asset) => {
                            if (err) return response.error(res, 500, err.message)
                            else {
                                asset.save();
                                user.assets.push(asset);
                                user.save();
                                org.assets.push(asset);
                                org.save()
                                response.success(res, 200, 'Asset record added successfully')
                            }
                        })
                    }
                })
            }
        })
        .catch((err) => {
            response.error(res, 500, err.message)
        })
}

export const modifyAsset = (req, res) => {
    const { Asset, TenantOrganization, User } = req.dbModels;
    TenantOrganization.findOne({ urlname: req.params.urlname }).populate("employees", "username -_id")
        .then((org) => {
            var list = [];
            org.employees.forEach(employee => list.push(employee.username))
            if (!list.includes(req.body.acquiredBy)) {
                console.log(list)
                return response.error(res, 422, 'This employee does not exist')
            }
            else if ((new Date(req.body.dateAcquired)).getTime() >= (new Date(req.body.dateReleased)).getTime()) {
                return response.error(res, 422, 'Release date must be later than acquired date')
            }
            else {
                User.findOne({ username: req.body.acquiredBy }, (err, user) => {
                    if (err) return response.error(res, 500, err.message)
                    else if (!user) return response.error(res, 404, 'User does not exist')

                    else {
                        Asset.findOneAndUpdate({ _id: req.params.asset_id }, { ...req.body, modifiedBy: req.user.username }, (err, asset) => {
                            if (err) return response.error(res, 500, err.message)
                            else if (!asset) return response.error(res, 404, 'Asset not found')
                            else {
                                asset.save();
                                response.success(res, 200, asset)
                            }
                        })
                    }
                })
            }
        })
        .catch((err) => {
            response.error(res, 500, err.message)
        })
}

export const deleteAsset = (req, res) => {
    const { Asset } = req.dbModels;
    Asset.findByIdAndDelete(req.params.asset_id, (err, asset) => {
        if (err) return response.error(res, 500, err.message)
        else if (!asset) return response.error(res, 404, 'Asset not found')
        else {
            response.success(res, 200, 'Asset record deleted successfully')
        }
    })
}
export const fetchAssets = (req,res)=>{
    const {Asset} = req.dbModels;
    Asset.find({}) 
    .then(assets=>{
        if(!assets) return response.success(res,204, 'No assets found')
        else{
            return response.success(res,200,assets)
        }
    })
    .catch(err=>{
        return response.error(res,500,err.message)
    })
}
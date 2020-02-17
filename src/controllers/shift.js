import {User} from '../models/User';
import {Organization} from '../models/Organization'
import {Shift} from '../models/Shift'

// create a workshift schedule
// @POST /:urlname/shifts/new
// Access: Admin
export const createShift = (req,res)=>{
// Fetch Organization
  Organization.findOne({name: req.params.urlname}, (err,org)=>{
    if(err){
        return res.status(500).json({message: err.message})
    } else if(!org){
        return res.status(404).json({message: 'No organization with this name was found... please check again'})
    } else if(!req.user._id){
        return res.status(401).json({message: 'You need to be logged in'})
    } 
    else if(org.admin.indexOf(req.user._id == -1)){
        return res.status(401).json({message: 'You are unauthorized to create a shift'})
    } else{
            User.findById(req.user._id, (err,user)=>{
                if(!err){
                    Shift.findByIdAndUpdate(req.params.shift, ...req.body , (err,shift)=>{
                        if(err){
                            return res.status(500).json({message: err.message})
                        } else{
                            shift.save();
                            org.shifts.push(shift);
                            user.shifts.push(shift);
                            user.save();
                            org.save()
                            return res.status(200).json({message: 'Shift created successfully and saved to organization'})
                        }
                            })
                } else{
                    res.status(404).json({message: 'Sorry, user not found'})
                }
            })
            }
        })  

    }

export const updateShift  = (req,res)=>{
    Organization.findOne({name: req.params.urlname}, (err,org)=>{
        if(err){
            return res.status(500).json({message: err.message})
        } else if(!org){
            return res.status(404).json({message: 'No organization with this name was found... please check again'})
        } else if(!req.user){
            return res.status(401).json({message: 'You need to be logged in'})
        } 
        else if(org.admin.indexOf(req.user._id == -1)){
            return res.status(401).json({message: 'You are unauthorized to create a shift'})
        }
         else{
                Shift.findByIdAndUpdate(req.params.id, ...req.body,(err,shift)=>{                     
                            if(err){
                                return res.status(500).json({message: err.message})
                            } else if(shift.createdBy !== req.user.username){
                                return res.status(401).json({message: 'You cannot edit this shift'})
                            } else{                             
                                shift.save();
                                return res.status(200).json({message: 'Shift updated successfully and saved to organization'})
                            }
                                })
                    } 
                })
                }

export const deleteShift = (req,res)=>{
    Organization.findOne({name: req.params.urlname}, (err,org)=>{
        if(err){
            return res.status(500).json({message: err.message})
        } else if(!org){
            return res.status(404).json({message: 'No organization with this name was found... please check again'})
        } else if(!req.user){
            return res.status(401).json({message: 'You need to be logged in'})
        } 
        else if(org.admin.indexOf(req.user._id == -1)){
            return res.status(401).json({message: 'You are unauthorized to delete a shift'})
        }
         else{
                Shift.findByIdAndDelete(req.params.id, (err,shift)=>{                     
                            if(err){
                                return res.status(500).json({message: err.message})
                            } else if(shift.createdBy !== req.user.username){
                                return res.status(401).json({message: 'You cannot delete this shift'})
                            } else{                             
                                return res.status(200).json({message: 'Shift deleted successfully'})
                            }
                                })
                    } 
                })
}
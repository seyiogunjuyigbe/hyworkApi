import {Travel} from '../models/Travel';
import {User} from '../models/User';
import {Organization} from '../models/Organization';
const response = require ('../middlewares/response');
import {MAIL_SENDER} from '../config/constants';
import {sendMailToTheseUsers} from '../middlewares/mail'
import {getDIfferenceinDays} from '../middlewares/middleware'


// Create a travel request record
export const createTravelRecord = (req,res)=>{
    if((new Date(req.body.departureDate)).getTime() >= (new Date(req.body.arrivalDate)).getTime()){
        return response.error(res,422,'arrival date must be later than departure date')
        }
        else if((new Date(req.body.departureDate)).getTime() <= (new Date()).getTime()){
       return response.error(res,422,'departure date can not be earlier than today')
        }  
        else if(!!req.body.isBillableToCustomer && Boolean(req.body.isBillableToCustomer) == true && !req.body.customerName){
            return response.error(res,422,'Please fill in customer name')
        }
  Organization.findOne({urlname:req.params.urlname})
  .then((org)=>{
      User.findOne({username:req.body.requestor},(err,thisUser)=>{
        if(err) return response.error(res,500,err.message)
        else if(!thisUser || !org.employees.includes(thisUser._id)) return response.error(res,404,'User not found')
        else{
            Travel.create({...req.body,createdBy:req.user,
                            createdAt:new Date().toTimeString(),
                            numberOfDays: getDIfferenceinDays(req.body.departureDate,req.body.arrivalDate)
                        },(err,travel)=>{
                if(err) return response.error(res,500,err.message)
                else{
                    travel.save();
                    org.travels.push(travel);
                    thisUser.travels.push(travel);
                    thisUser.save();
                    org.save()
                    return response.success(res,200,travel)
                }
            })
        }
    })

  })
  .catch((err)=>{return response.error(res,500,err.message)})
}


// Update travel request records
export const updateTravelRecord = (req,res)=>{
    User.findOne({username:travel.requestor})
    .then((thisUser)=>{
        if(!user)response.error(res,404,'User not found for this travel record');
        else{
        if(user.username !== travel.requestor || travel.approvalStatus !== 'Pending') return response.error(res,403,'You cannot edit this request as it has been attended to')
       else{
    Travel.findByIdAndUpdate(req.params.travel_id, {...req.body, numberOfDays: getDIfferenceinDays(req.body.departureDate,req.body.arrivalDate),modifiedBy:req.user,modifiedAt: new Date().toTimeString()}, (err,travel)=>{
        if(err)return response.error(res,500,err.message)
        else if(!travel) response.error(res,404,'Travel record not found');
        else if(travel.createdBy !== req.user.username){
            return response.error(res,403,"You're not authorized to do so")
        }
        else  { 
            travel.save()
           return response.success(res,200,'Travel record updated sucessfully')
        }
    })
}
        }
    })
}


export const approveTravelRequest = (req,res)=>{
    Organization.findOne({urlname:req.params.urlname},(err,org)=>{
        if(err) return response.error(res,500,err.message);
        else if(!org) return response.error(res,404,'Organization not found');
        else {  
      Travel.findById(req.params.travel_id,(err,travel)=>{
        if(err)return response.error(res,500,err.message)
        else if(!travel) response.error(res,404,'Travel record not found')
        else if(travel.approvalStatus !== 'Pending') return response.error(res,403,'This request has been responded to already')
        else  { 
            User.findOne({username:travel.requestor})
            .then((thisUser)=>{
                if(!thisUser)response.error(res,404,'User not found for this travel record');
                else if(thisUser.username == req.user.username) return response.error(res,403,'You are not authorized to accept this request')
               else{
                travel.approvalStatus = 'Approved';
                travel.modifiedBy = req.user;
                travel.modifiedAt = new Date().toTimeString()
                travel.save();
                var mailOptions = {
                        from: MAIL_SENDER,
                        to: thisUser.email,
                        subject: `Your travel request has been approved`,
                        html: 
                            ` Dear ${thisUser.firstName} ${thisUser.lastName}, your travel request has been approved!        
                            <a href="http://${req.headers.host}/org/${org.urlname}/travel/${travel._id}/view" style="font-family:candara;font-size:1.2em">Click to view travel details</a>
                                `,
                            };
            sendMailToTheseUsers(req,res,mailOptions)
            return response.success(res,200,'Travel record approved')   
             }                      
            })
            .catch((err)=>response.error(res,500,err.message))

        }
    })
}
})
}


export const declineTravelRequest = (req,res)=>{
    Organization.findOne({urlname:req.params.urlname},(err,org)=>{
        if(err) return response.error(res,500,err.message);
        else if(!org) return response.error(res,404,'Organization not found');
        else {  
      Travel.findById(req.params.travel_id,(err,travel)=>{
        if(err)return response.error(res,500,err.message)
        else if(!travel) response.error(res,404,'Travel record not found')
        else if(travel.approvalStatus !== 'Pending') return response.error(res,403,'This request has been responded to already')
        else  { 
            User.findOne({username:travel.requestor})
            .then((thisUser)=>{
                if(!thisUser)response.error(res,404,'User not found for this travel record');
                else if(thisUser.username == req.user.username) return response.error(res,403,'You are not authorized to accept this request')
               else{
                travel.approvalStatus = 'Declined';
                travel.modifiedBy = req.user;
                travel.modifiedAt = new Date().toTimeString()
                travel.save();
                var mailOptions = {
                        from: MAIL_SENDER,
                        to: thisUser.email,
                        subject: `Your travel request has been declined`,
                        html: 
                            ` Dear ${thisUser.firstName} ${thisUser.lastName},sorry, your travel request has been declined...        
                            <a href="http://${req.headers.host}/org/${org.urlname}/travel/${travel._id}/view" style="font-family:candara;font-size:1.2em">Click to view travel details</a>
                                `,
                            };
            sendMailToTheseUsers(req,res,mailOptions)
            return response.success(res,200,'Travel record declined')   
             }                      
            })
            .catch((err)=>response.error(res,500,err.message))

        }
    })
}
})
}

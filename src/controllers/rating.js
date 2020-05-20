const response = require('../middlewares/response');

export const addRating = (req,res)=>{
    const {User, Rating,Appraisal} = req.dbModels;
    const {value,comment,employee_id,type,description} = req.body;
    const{token} = req.params
    User.findById(employee_id)
    .then(employee=>{
        if(!employee) return response.error(res,404,'Employee not found')
        else{
            Appraisal.findOne({token})
            .then(appraisal=>{
                if(!appraisal) return response.error(res,404,'Appraisal record not found')
                else if(!appraisal.employees.includes(employee._id)) return response.error(res,403,'Employee not included in this cycle')
                else{
                    Rating.findOne({employee_id:employee._id,assessor_id:req.user._id, cycle_token:token})
                    .then(foundrating=>{
                        if(foundrating) return response.error(res,409,'You already rated this employee for this cycle')
                        else{
                            Rating.create({
                                value,comment,type,description,employee_id:employee._id,assessor_id:req.user._id,cycle_token:token
                            })
                            .then(rating=>{
                                rating.save((err,done)=>{
                                    if(err) return response.error(res,500,err.message)
                                    else return response.success(res,200,rating)
                                })
                            })
                            .catch(err=>{
                                return response.error(res,500,err.message)
                            })
                        }
                    })
                    .catch(err=>{
                        return response.error(res,500,err.message)
                    })

                }
            })
            .catch(err=>{
                return response.error(res,500,err.message)
            })

        }
    })
    .catch(err=>{
        return response.error(res,500,err.message)
    })
}
export const createAppraisalCycle = (req,res)=>{
    const {urlname} = req.params
    const {User, Appraisal, TenantOrganization} = req.dbModels;
    Appraisal.create({...req.body})
    .then(appraisal=>{
        appraisal.createdBy = req.user._id
        appraisal.save();
        return response.success(res,200,appraisal)
    })
    .catch(err=>{
        return response.error(res,500,err.message)
    })
}
export const addUsersToAppraisal = (req,res)=>{
    const {TenantOrganization, Appraisal} = req.dbModels;
    const {urlname,token} = req.params;
    const {employees} = req.body
    TenantOrganization.findOne({ urlname}).populate("employees").exec((err, org) => {
            var list = [];
            org.employees.forEach(employee => list.push(String(employee._id)));
            if (!list.includes(...employees)) {
                console.log({list,employees})
                return response.error(res, 422, 'You have included an employee who is not an employee of this organization');
            }
            else {
                Appraisal.findOne({token})
                .then(appraisal=>{
                    if(!appraisal) return response.error(res,404,'Appraisal cycle does not exist')
                    else{
                        employees.forEach((employee) => {
                            if(!appraisal.employees.includes(employee)){
                               var i = list.indexOf(employee);
                            appraisal.employees.push(org.employees[i]._id); 
                            }
                            else{
                                console.log('Duplicate id  '+ employee + ' not added')
                            }
                        });
                        appraisal.save()
                        return response.success(res,200,'Employees added to appraisal cycle')
                    }
                })
}
if(err) return response.error(res,500,err.message)
    })
}
export const calculateUserRating=(req,res)=>{
    const {employee_id,} = req.body;
    const {User,Rating,Appraisal} = req.dbModels;
    const {token} = req.params
    User.findById(employee_id)
    .then(employee=>{
        if(!employee) return response.error(res,404,'Employee not found')
        else{
            Appraisal.findOne({token})
            .then(appraisal=>{
                if(!appraisal) return response.error(res,404,'Appraisal Cyce not found');
                else{
                    Rating.find({cycle_token:appraisal.token,employee_id})
                    .then(ratings=>{
                        if(ratings.length == 0) return response.success(res,204,'No ratings found')
                        else{
                            var total = 0;
                            ratings.forEach(rating=>{
                                total += rating.value
                            })
                            console.log(total)
                        }
                    })
                }
            })
            .catch(err=>{
                return response.error(res,500,err.message)
            })
        }
    })
    .catch(err=>{
        return response.error(res,500,err.message)
    })
}
import { Kra } from '../models/Kra';

const response = require('../middlewares/response');

export const addRating = (req,res)=>{
    const {User, Rating,Appraisal,Kra} = req.dbModels;
    const {value,comment,employee_id,type,description,kra_token,max_value} = req.body;
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
                            if(type == 'KRA' && !kra_token) return response.error(res,400,'KRA token is required')
                            Rating.create({
                                value,max_value,comment,type,description,kra_token,employee_id:employee._id,assessor_id:req.user._id,cycle_token:token
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
    const {User,Rating,Appraisal} = req.dbModels;
    const {token,employee_id,type} = req.params;
    User.findById(employee_id).populate('kras')
    .then(employee=>{
        if(!employee) return response.error(res,404,'Employee not found')
        else{
            Appraisal.findOne({token})
            .then(appraisal=>{
                if(!appraisal) return response.error(res,404,'Appraisal Cyce not found');
                else{
                    Rating.find({cycle_token:appraisal.token,employee_id,type})
                    .then(ratings=>{
                        if(ratings.length == 0) return response.success(res,204,'No ratings found')
                        else{
                            var total = 0;
                            ratings.forEach(rating=>{
                                total += rating.value/rating.max_value
                            })
                            var percentage = `${((total/ratings.length) * 100).toFixed(1)}%`;
                            return response.success(res,200,percentage)
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

// Create KRA record for em[ployee
export const createKra = (req,res)=>{
    const {Kra} = req.dbModels;

                    Kra.create({...req.body,created_by:req.user._id})
                    .then(kra=>{
                        kra.save((err,done)=>{
                            if(err) return response.error(res,500,err.message)
                            else return response.success(res,200,kra)
                        })
                    })
                    .catch(err=>{
                        return response.error(res,500,err.message)
                    })
                }
export const addWeightageToKRA = (req,res)=>{
    const {token } = req.params;
    const {weightage} = req.body;
    const {Kra} = req.dbModels
        Kra.findOne({token})
        .then(kra=>{
            if(!kra) return response.error(res,404,'KRA record not found');
            else{
                kra.weightage = weightage;
                kra.save((err,done)=>{
                    if(err) return response.error(res,500,err.message)
                    else{
                        return response.success(res,200,kra)
                    }
                })
            }
        })
        .catch(err=>{
            return response.error(res,500,err.message)
        })
        }
export const editKRA = (req,res)=>{
    const {token } = req.params;
    const {Kra} = req.dbModels
        Kra.findOneAndUpdate({token}, {...req.body})
        .then(kra=>{
            if(!kra) return response.error(res,404,'KRA record not found');
            else{
                kra.save((err,done)=>{
                    if(err) return response.error(res,500,err.message)
                    else{
                        return response.success(res,200,'KRA updated')
                    }
                })
            }
        })
        .catch(err=>{
            return response.error(res,500,err.message)
        })
}
export const deleteKRA = (req,res)=>{
    const {token } = req.params;
    const {Kra} = req.dbModels
        Kra.findOneAndDelete({token})
        .then(kra=>{
            if(!kra) return response.error(res,404,'KRA record not found');
            else{
                        return response.success(res,200,"KRA deleted")
                    }
                })      
        .catch(err=>{
            return response.error(res,500,err.message)
        })
}
export const tagEmployeeToKRA= (req,res)=>{
const {Kra, User} = req.dbModels;
const {employee_id,token} = req.params
Kra.findOne({token})
.then(kra=>{
    if(!kra) return response.error(res,404,'KRA record not found');
    else{
        User.findById(employee_id)
        .then(employee=>{
            if(!employee) return response.error(res,404,'Employee record not found');
            else{
                if(employee.kras.includes(kra._id)){
                    return response.error(res,409,'KRA already tagged to employee ' + employee.firstName)
                }
                employee.kras.push(kra);
                employee.save();
                return response.success(res,200,'KRA tagged to employee '+ employee.firstName)
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
export const tagDeptToKRA= (req,res)=>{
    const {Kra, User,Department} = req.dbModels;
    const {dept_id,token} = req.params
    Kra.findOne({token})
    .then(kra=>{
        if(!kra) return response.error(res,404,'KRA record not found');
        else{
            Department.findById(dept_id)
            .then(department=>{
                if(!department) return response.error(res,404,'Department record not found')
                else{
                    User.find({department:department._id})
                    .then(employees=>{
                        if(!employees || employees.length == 0) return response.error(res,204,'No employees found in department');
                        else{
                            employees.forEach(employee=>{
                                if(!employee.kras.includes(kra._id)){
                                employee.kras.push(kra);
                                employee.save();  
                                } 
                            })
                            return response.success(res,200,'KRA tagged to ' + department.title + ' department successfully')
                        }
                    })
                }
            })
            
        }
    })
}
export const tagRoleToKRA= (req,res)=>{
    const {Kra, User,Role} = req.dbModels;
    const {role_id,token} = req.params
    Kra.findOne({token})
    .then(kra=>{
        if(!kra) return response.error(res,404,'KRA record not found');
        else{
            Role.findById(role_id)
            .then(role=>{
                if(!role) return response.error(res,404,'Role record not found')
                else{
                    User.find({role:role._id})
                    .then(employees=>{
                        if(!employees || employees.length == 0) return response.error(res,204,'No employees found in department');
                        else{
                            employees.forEach(employee=>{
                            if(!employee.kras.includes(kra._id)){
                            employee.kras.push(kra);
                            employee.save();  
                            }
                            })
                            return response.success(res,200,'KRA tagged to ' + role.title + ' role successfully')
                        }
                    })
                }
            })
            
        }
    })
}
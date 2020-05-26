const response = require('../middlewares/response');

module.exports = {
createRole(req,res){
const {Role} = req.dbModels;
const {title,description} = req.body
Role.findOne({title:title.toUpperCase()})
.then(role=>{
    if(role) return response.error(res,409,'Role ' + title + ' already exists')
    else{
        Role.create({title,description})
        .then(role=>{
            role.save();
            return response.success(res,200,'Role created successfully')
        })
        .catch(err=>{
            return response.error(res,500,err.message)
        })

    }
})
.catch(err=>{
            return response.error(res,500,err.message)
        })
},
assignUserToRole(req,res){
const {User,Role} = req.dbModels
const {employee_id,role_id} = req.params;
User.findById(employee_id)
.then(user=>{
    if(!user) return response.error(res,404,'Employee not found');
    else{
        Role.findById(role_id)
        .then(role=>{
            if(!role) return response.error(res,404,'Specified role not found')
            else{
                user.role = role
                user.save((err,done)=>{
                    if(err) return response.error(res,500,err.message)
                });
                return response.success(res,200,'Role assigned to employee successfully')
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
},
updateRole(req,res){
const {Role} = req.dbModels;
const {role_id} = req.params
const {title,description} = req.body;
Role.findByIdAndUpdate(role_id, {title,description})
.then(role=>{
    if(!role) return response.error(res,404,'Role not found');
    else{
        role.save();
        return response.success(res,200,'Role updated successfiully')
    }
})
},
deleteRole(req,res){
    const {Role} = req.dbModels;
    const {role_id} = req.params
    Role.findByIdAndDelete(role_id)
    .then(role=>{
        if(!role) return response.error(res,404,'Role not found');
        else{
            return response.success(res,200,'Role deleted successfiully')
        }
    })
},
fetchUsersWithThisRole(req,res){
    const {Role,User} = req.dbModels;
    const {role_id} = req.params;
    User.find({role:role_id})
    .then(users=>{
        if(!users || users.length == 0) return response.success(res,204,'No users found')
        else{
            return response.success(res,200,users)
        }
    })
    .catch(err=>{
        return response.error(res,500,err.mesage)
    })
}
}
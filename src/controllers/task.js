import { crudControllers } from '../utils/crud';

// import moment from 'moment';
const response = require("../middlewares/response");
const moment = require('moment')


//Create Task
// Route: org/:urlname/task/add/:username
export const createTask = async (req, res) => {
    const { urlname, username } = req.params;
    const { title, description } = req.body
    const { Task, User, TenantOrganization } = req.dbModels;

    try {
        const org = await TenantOrganization.findOne({ urlname });
        if (org.employees.includes(req.user._id)) {
            Task.create({ title, description }, (err, task) => {
                if (err) { return response.error(res, 404, err.nessage) }
                User.findOne({ username }, (err, user) => {
                    if (err) { return response.error(res, 404, err.message) }
                    task.assignedBy = req.user._id;
                    task.assignedTo = user._id;
                    task.timeAssigned = Date.now();
                    task.save().then(
                        response.success(res, 200, task)
                    )
                })
            })
        } else {
            return response.error(res, 404, `User is not an employee `)
        }

    } catch (error) {
        return response.error(res, 500, `Could not find organization`)
    }
}
// Add a file to a task
//Route: org/:urlname/task/:id/add/file/:fileId
export const addFiletoTask = async (req, res) => {
    const { Task, File, TenantOrganization } = req.dbModels;
    const { urlname, id, fileId } = req.params;
    try {
        const org = await TenantOrganization.findOne({ urlname });
        if (org.employees.includes(req.user._id)) {
            Task.findById(id, (err, task) => {
                if (err) { return response.error(res, 404, err.message) }
                File.findById(fileId, (err, file) => {
                    if (err) { return response.error(res, 404, err.message) }
                    if (task.files.includes(file._id)) { return response.error(res, 404, `File has already been added`) }
                    task.files.push(file._id);
                    task.save().then(
                        response.success(res, 200, `File ${file.title} has been added to task ${task.title}`)
                    )
                })
            })
        }
    } catch (error) {
        response.error(res, 500, error.message)
    }
}


//Get tasks assigned to a User
//Route: org/:urlname/task/assignedto/:username
export const getTasksAssignedToUser = async (req, res) => {
    const { Task, User } = req.dbModels;
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (user) {
            Task.find({ assignedTo: user._id }, (err, tasks) => {
                if (err) { return response.error(res, 404, err.message) }
                response.success(res, 200, tasks);
            })
        }

    } catch (error) {
        response.error(res, 500, error.message)
    }
}

// export const getTasksAssignedByMe = async(req, res) => {
//     // const { username } = req.params;
//     try {
//         if(req.user) { 
//             Task.find({ assignedBy: req.user._id}, (err, tasks) => {
//                 if(err) { return response.error(res, 404, err.message) }
//                 response.success(res, 200, tasks);
//             })
//         } 

//     }catch (error) {
//         response.error(res, 500, error.message)
//     }
// }


export const getFilesAssignedToTask = async (req, res) => {
    const { id } = req.params;
    const { Task } = req.dbModels;

    try {
        const taskFiles = await Task.findById(id).populate('files');
        if (taskFiles) {
            response.success(res, 201, taskFiles);
        }

    } catch (error) {
        response.error(res, 500, error.message);
    }
};

export const addDeadlineToTask = (req, res) => {
    const { id } = req.params;
    const { deadline } = req.body;
    const { Task } = req.dbModels;

    Task.findById(id, (err, task) => {
        if (err) response.success(res, 500, err);
        if (!task.deadline){
            task.deadline = Date.parse(deadline);
        console.log(task.deadline);
        task.save().then(response.success(res, 200, 'Task deadline added'));
        }
        return response.error(res, 404, 'Deadline already added to this task');

    });

}




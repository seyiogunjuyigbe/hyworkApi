import { userSchema } from './User';
import { assetSchema } from './Asset';
import { travelSchema } from './Travel';
import { taskSchema } from './Task';
import { tokenSchema } from './Token';
import { shiftSchema } from './Shift';
import { serviceSchema } from './Service';
import { projectSchema } from './Project';
import { organizationSchema } from './Organization';
import { messageSchema } from './Message';
import { locationSchema } from './Location';
import { leaveSchema } from './Leave';
import { jobSchema } from './Job';
import { goalSchema } from './Goal';
import { formSchema } from './Form';
import { fileSchema } from './File';
import { attendanceSchema } from './Attendance';
import { benefitSchema } from './Benefit';
import { caseSchema } from './Case';
import { commentSchema } from './Comment';
import { delegationSchema } from './Delegation';
import { departmentSchema } from './Department';
import { dependentSchema } from './Dependent';
import { fieldSchema } from './Field';


//Tenant Models
// export const Asset = dbConnection.model('Asset', assetSchema);
// export const Attendance = dbConnection.model('Attendance', attendanceSchema);
// export const Benefit = dbConnection.model('Benefit', benefitSchema);
// export const Case = dbConnection.model('Case', caseSchema);
// export const Comment = dbConnection.model('Comment', commentSchema);
// export const Delegation = dbConnection.model('Delegation', delegationSchema);
// export const Department = dbConnection.model('Department', departmentSchema);
// export const Dependent = dbConnection.model('Dependent', dependentSchema);
// export const Form = dbConnection.model('Form', formSchema);
// export const File = dbConnection.model('File', fileSchema);
// export const Field = dbConnection.model('Field', fieldSchema);
// export const Goal = dbConnection.model('Goal', goalSchema);
// export const Job = dbConnection.model('Job', jobSchema);
// export const Leave = dbConnection.model('Leave', leaveSchema);
// export const Location = dbConnection.model('Location', locationSchema);
// export const Message = dbConnection.model('Message', messageSchema);
// export const Organization = dbConnection.model('Organization', organizationSchema);
// export const Project = dbConnection.model('Project', projectSchema);
// export const Service = dbConnection.model('Service', serviceSchema);
// export const Shift = dbConnection.model('Shift', shiftSchema);
// export const Task = dbConnection.model('Task', taskSchema);
// export const Token = dbConnection.model('Token', tokenSchema);
// export const Travel = dbConnection.model('Travel', travelSchema);
// export const User = dbConnection.model('User', userSchema);

export const models = (connection) => {
    Asset: connection.model('Asset', assetSchema);
    Attendance: connection.model('Attendance', attendanceSchema);
    Benefit: connection.model('Benefit', benefitSchema);
    Case: connection.model('Case', caseSchema);
    Comment: connection.model('Comment', commentSchema);
    Delegation: connection.model('Delegation', delegationSchema);
    Department: connection.model('Department', departmentSchema);
    Dependent: connection.model('Dependent', dependentSchema);
    Form: connection.model('Form', formSchema);
    File: connection.model('File', fileSchema);
    Field: connection.model('Field', fieldSchema);
    Goal: connection.model('Goal', goalSchema);
    Job: connection.model('Job', jobSchema);
    Leave: connection.model('Leave', leaveSchema);
    Location: connection.model('Location', locationSchema);
    Message: connection.model('Message', messageSchema);
    Organization: connection.model('Organization', organizationSchema);
    Project: connection.model('Project', projectSchema);
    Service: connection.model('Service', serviceSchema);
    Shift: connection.model('Shift', shiftSchema);
    Task: connection.model('Task', taskSchema);
    Token: connection.model('Token', tokenSchema);
    Travel: connection.model('Travel', travelSchema);
    User: connection.model('User', userSchema);

}


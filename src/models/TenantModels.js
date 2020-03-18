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



module.exports = {
    Asset: assetSchema,
    Attendance: attendanceSchema,
    Benefit: benefitSchema,
    Case: caseSchema,
    Comment: commentSchema,
    Delegation: delegationSchema,
    Department: departmentSchema,
    Dependent: dependentSchema,
    Form: formSchema,
    File: fileSchema,
    Field: fieldSchema,
    Goal: goalSchema,
    Job: jobSchema,
    Leave: leaveSchema,
    Location: locationSchema,
    Message: messageSchema,
    TenantOrganization: organizationSchema,
    Project: projectSchema,
    Service: serviceSchema,
    Shift: shiftSchema,
    Task: taskSchema,
    Token: tokenSchema,
    Travel: travelSchema,
    User: userSchema

}


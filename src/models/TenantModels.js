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
import { timeLogSchema } from './Timelog';
import {timesheetSchema} from './Timesheet'
import {appraisalSchema} from './Appraisal'
import{ratingSchema} from './Rating'
import {roleSchema} from './Role'
import {kraSchema} from './Kra';
import {feedbackSchema} from './Feedback'
module.exports = {
    Asset: assetSchema,
    Appraisal:appraisalSchema,
    Attendance: attendanceSchema,
    Benefit: benefitSchema,
    Case: caseSchema,
    Comment: commentSchema,
    Delegation: delegationSchema,
    Department: departmentSchema,
    Dependent: dependentSchema,
    Feedback: feedbackSchema,
    Form: formSchema,
    File: fileSchema,
    Field: fieldSchema,
    Goal: goalSchema,
    Job: jobSchema,
    Kra: kraSchema,
    Leave: leaveSchema,
    Location: locationSchema,
    Message: messageSchema,
    TenantOrganization: organizationSchema,
    Project: projectSchema,
    Rating: ratingSchema,
    Role: roleSchema,
    Service: serviceSchema,
    Shift: shiftSchema,
    Task: taskSchema,
    Timelog: timeLogSchema,
    Timesheet: timesheetSchema,
    Token: tokenSchema,
    Travel: travelSchema,
    User: userSchema

}


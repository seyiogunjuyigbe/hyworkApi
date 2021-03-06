const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Schema = mongoose.Schema;
import {Token} from './Token';
import {SECRET_KEY} from '../config/constants';
const passportLocalMongoose = require('passport-local-mongoose');

export const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      // required: 'You must have a username'
    },
    avatar: String,
    firstName: {
      type: String,
      trim: true,
      required: 'You must have a first name'
    },
    lastName: {
      type: String,
      trim: true,
      required: 'You must have a last name'
    },
    phoneNumber: {
      type: String,
      trim: true
    },
    phoneNumber2: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: 'You must have an email'
    },
    email2: {
      type: String,
      trim: true
    },
    password: {
      type: String,
      // required: 'You need a password', Pass
      minlength: 8
    },
    dob: {
      type: Date
    },
    maritalStatus: {
      type: String,
    },
    category: {
      type: String
    },
    employeeId: {
      type: String
    },
    role: {
      type: String,
    },
    joinDate: {
      type: Date
    },
    timeJoined: {
      type: String
    },
    timezone: {
      type: String
    },
    address: {
      type: String
    },
    employmentStatus: {
      type: String
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task"
      }
    ],
    files: [
      {
        type: Schema.Types.ObjectId,
        ref: "File"
      }
    ],
    assets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Asset"
      }
    ],
    dependents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Dependent"
      }
    ],
    travels: {
      type: Schema.Types.ObjectId,
      ref: "Travel"
    },
    reportingTo: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    kras:[{
      type: Schema.Types.ObjectId,
      ref: 'Kra'
    }],
    skills: [],
    benefits: [
      {
        type: Schema.Types.ObjectId,
        ref: "Benefit"
      }
    ],
    leave: [
      {
        type: Schema.Types.ObjectId,
        ref: "Leave"
      }
    ],
    attendance: [
      {
        type: Schema.Types.ObjectId,

        ref: "Attendance"
      }
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message"
      }
    ],
    goals: [
      {
        type: Schema.Types.ObjectId,
        ref: "Goal"
      }
    ],
    education: [],
    previousJobExperience: [],
    bioMessage: String,
    jobDescription: String,
    location: {
      type: Schema.Types.ObjectId,
      ref: "Location"
    },
    seatingLocation: [
      {
        type: Schema.Types.ObjectId,
        ref: "Location"
      }
    ],
    hireSource: String,
    expertise: [],
    delegation: [
      {
        type: Schema.Types.ObjectId,
        ref: "Delegation"
      }
    ],
    cases: [
      {
        type: Schema.Types.ObjectId,
        ref: "Case"
      }
    ],
    affiliatedOrg: {
      type: Schema.Types.ObjectId,
      ref: "Organization"
    },
    createdOrganizations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Organization"
      }
    ],
    jobs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Job"
      }
    ],
    timeLogs: [
      {
        type: Schema.Types.ObjectId,
        ref: "TimeLog"
      }
    ],
    jobLogs: [{
      job_id: String,
      hours: {type: Number, default: 0}
    }],
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project"
      }
    ],
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: "Service"
      }
    ],
    shifts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Shift"
      }
    ],
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department"
    },
    travels: [
      {
        type: Schema.Types.ObjectId,
        ref: "Travel"
      }
    ],
    isVerified: {
      type: Boolean,
      default: false
  },
  tempPassword:String,
  resetPasswordToken: {
      type: String,
      required: false
  },

  resetPasswordExpires: {
      type: Date,
      required: false
  },
  token: String
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose);
// userSchema.methods.comparePassword = function(password) {
//   return bcrypt.compareSync(password, this.password);
// };
userSchema.methods.generatePasswordReset = function() {
  this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

userSchema.methods.generateVerificationToken = function() {
  
  let payload = {
      userId: this._id,
      token: crypto.randomBytes(20).toString('hex')
  };

  return new Token(payload);
};

userSchema.methods.generateUsername = () => {
  this.username = this.firstName[0] + this.firstName[this.firstName.length - 1] + "." + this.lastName;
}

export const User = mongoose.model('User', userSchema);
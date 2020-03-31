"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.User = exports.userSchema = void 0;

var _Token = require("./Token");

var _constants = require("../config/constants");

var _ref,
    _this = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var mongoose = require("mongoose");

var bcrypt = require("bcryptjs");

var jwt = require('jsonwebtoken');

var crypto = require('crypto');

var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema((_ref = {
  username: {
    type: String,
    trim: true,
    unique: true // required: 'You must have a username'

  },
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
    "enum": ['single', 'married', 'divorced']
  },
  category: {
    type: String
  },
  employeeId: {
    type: String
  },
  role: {
    type: String,
    "enum": ['user', 'manager', 'admin']
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
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: "Task"
  }],
  files: [{
    type: Schema.Types.ObjectId,
    ref: "File"
  }],
  assets: [{
    type: Schema.Types.ObjectId,
    ref: "Asset"
  }],
  dependents: [{
    type: Schema.Types.ObjectId,
    ref: "Dependent"
  }],
  travels: {
    type: Schema.Types.ObjectId,
    ref: "Travel"
  },
  reportingTo: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  skills: [],
  benefits: [{
    type: Schema.Types.ObjectId,
    ref: "Benefit"
  }],
  leave: [{
    type: Schema.Types.ObjectId,
    ref: "Leave"
  }],
  attendance: [{
    type: Schema.Types.ObjectId,
    ref: "Attendance"
  }],
  messages: [{
    type: Schema.Types.ObjectId,
    ref: "Message"
  }],
  goals: [{
    type: Schema.Types.ObjectId,
    ref: "Goal"
  }],
  education: [],
  previousJobExperience: [],
  bioMessage: String,
  jobDescription: String,
  location: {
    type: Schema.Types.ObjectId,
    ref: "Location"
  },
  seatingLocation: [{
    type: Schema.Types.ObjectId,
    ref: "Location"
  }],
  hireSource: String,
  expertise: [],
  delegation: [{
    type: Schema.Types.ObjectId,
    ref: "Delegation"
  }],
  cases: [{
    type: Schema.Types.ObjectId,
    ref: "Case"
  }],
  affiliatedOrg: {
    type: Schema.Types.ObjectId,
    ref: "Organization"
  },
  createdOrganizations: [{
    type: Schema.Types.ObjectId,
    ref: "Organization"
  }],
  jobs: [{
    type: Schema.Types.ObjectId,
    ref: "Job"
  }],
  timeLogs: [{
    type: Schema.Types.ObjectId,
    ref: "TimeLog"
  }],
  jobLogs: [{
    job_id: String,
    hours: {
      type: Number,
      "default": 0
    }
  }],
  projects: [{
    type: Schema.Types.ObjectId,
    ref: "Project"
  }],
  services: [{
    type: Schema.Types.ObjectId,
    ref: "Service"
  }],
  shifts: [{
    type: Schema.Types.ObjectId,
    ref: "Shift"
  }],
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department"
  }
}, _defineProperty(_ref, "travels", [{
  type: Schema.Types.ObjectId,
  ref: "Travel"
}]), _defineProperty(_ref, "isVerified", {
  type: Boolean,
  "default": false
}), _defineProperty(_ref, "tempPassword", String), _defineProperty(_ref, "resetPasswordToken", {
  type: String,
  required: false
}), _defineProperty(_ref, "resetPasswordExpires", {
  type: Date,
  required: false
}), _defineProperty(_ref, "token", String), _ref), {
  timestamps: true
});
exports.userSchema = userSchema;
userSchema.plugin(passportLocalMongoose); // userSchema.methods.comparePassword = function(password) {
//   return bcrypt.compareSync(password, this.password);
// };

userSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

userSchema.methods.generateVerificationToken = function () {
  var payload = {
    userId: this._id,
    token: crypto.randomBytes(20).toString('hex')
  };
  return new _Token.Token(payload);
};

userSchema.methods.generateUsername = function () {
  _this.username = _this.firstName[0] + _this.firstName[_this.firstName.length - 1] + "." + _this.lastName;
};

var User = mongoose.model('User', userSchema);
exports.User = User;
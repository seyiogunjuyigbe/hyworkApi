const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true
    },
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
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
      unique: true
    },
    email2: {
      type: String,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    dob: {
      type: Date
    },
    maritalStatus: {
      type: String
    },
    category: {
      type: String
    },
    employeeId: {
      type: String
    },
    role: {
      type: String
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
    organizations: [
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
    ]
  },
  { timestamps: true }
);

userSchema.pre("save", function(next) {
  if (!this.isModified("password")) {
    return next();
  }

  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.password = hash;
    next();
  });
});

userSchema.methods.checkPassword = function(password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }

      resolve(same);
    });
  });
};

export const User = mongoose.model("User", userSchema);

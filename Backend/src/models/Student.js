import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    registrationNumber: {
      type: String,
      required: [true, "Registration number is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    personalInfo: {
      firstName: {
        type: String,
        default: "",
      },
      lastName: {
        type: String,
        default: "",
      },
      phoneNumber: {
        type: String,
        default: "",
      },
      dateOfBirth: {
        type: Date,
        default: null,
      },
      gender: {
        type: String,
        enum: ["Male", "Female", "Other", ""],
        default: "",
      },
      profilePicture: {
        type: String,
        default: "",
      },
    },
    academicInfo: {
      department: {
        type: String,
        default: "",
      },
      branch: {
        type: String,
        uppercase: true,
        default: "",
      },
      semester: {
        type: Number,
        default: null,
      },
      cgpa: {
        type: Number,
        default: null,
      },
      percentage: {
        type: Number,
        default: null,
      },
      backlogs: {
        type: Number,
        default: 0,
      },
      graduationYear: {
        type: Number,
        default: null,
      },
    },
    skills: [
      {
        type: String,
      },
    ],
    resume: {
      type: String,
      default: "",
    },
    resumeText: {
      type: String,
      default: "",
    },
    projects: [
      {
        title: String,
        description: String,
        technologies: [String],
        liveLink: String,
        githubLink: String,
      },
    ],
    internships: [
      {
        companyName: String,
        role: String,
        duration: String,
        description: String,
        startDate: Date,
        endDate: Date,
      },
    ],
    certifications: [
      {
        name: String,
        issuedBy: String,
        issueDate: Date,
        credentialUrl: String,
      },
    ],
    externalLinks: [
      {
        name: String,
        url: String,
      },
    ],
    socialLinks: {
      linkedin: String,
      github: String,
      portfolio: String,
    },
    placementStatus: {
      type: String,
      enum: ["unplaced", "placed", "pursuing_higher_studies"],
      default: "unplaced",
    },
    placedCompany: {
      type: String,
      default: "",
    },
    package: {
      type: Number,
      default: null,
    },
    placedAt: {
      type: Date,
      default: null,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    photo: {
      url: String,
      publicId: String,
    },
    resume: {
      url: String,
      publicId: String,
      uploadedAt: Date,
      parsedData: {
        type: mongoose.Schema.Types.Mixed,
      },
    },
  },
  {
    timestamps: true,
  },
);

const Student = mongoose.model("Student", studentSchema);

export default Student;

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
    registrationDate: {
      type: Date,
      required: true,
      default: Date.now,
      immutable: true,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    careerGuidanceStartDate: {
      type: Date,
      required: true,
    },

    accountStatus: {
      type: String,
      enum: ["active", "career_guidance_mode", "expired", "deleted"],
      default: "active",
      index: true,
    },

    // Extension requests
    extensionRequests: [
      {
        reason: String,
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        requestedAt: {
          type: Date,
          default: Date.now,
        },
        reviewedBy: mongoose.Schema.Types.ObjectId,
        reviewedAt: Date,
      },
    ],

    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: Date,

    deletionScheduledAt: Date,
  },
  {
    timestamps: true,
  },
);

studentSchema.pre("save", function (next) {
  // Only run on NEW documents (when first creating)
  if (this.isNew && !this.expiryDate) {
    const regDate = this.registrationDate || new Date();

    // Career guidance starts at day 365
    const guidanceStart = new Date(regDate);
    guidanceStart.setDate(guidanceStart.getDate() + 365);
    this.careerGuidanceStartDate = guidanceStart;

    // Account expires at day 375
    const expiry = new Date(regDate);
    expiry.setDate(expiry.getDate() + 375);
    this.expiryDate = expiry;

    // Deletion scheduled 90 days after expiry
    const deletion = new Date(expiry);
    deletion.setDate(deletion.getDate() + 90);
    this.deletionScheduledAt = deletion;
  }

  // ✅ CRITICAL: Always call next()
  next();
});

// ============================================
// METHODS
// ============================================
studentSchema.methods.getDaysUntilExpiry = function () {
  const today = new Date();
  const expiry = new Date(this.expiryDate);
  const diffTime = expiry - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

studentSchema.methods.isInCareerGuidanceMode = function () {
  const today = new Date();
  const guidanceStart = new Date(this.careerGuidanceStartDate);
  const expiry = new Date(this.expiryDate);
  return today >= guidanceStart && today < expiry;
};

const Student = mongoose.model("Student", studentSchema);

export default Student;

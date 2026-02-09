import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Student from "../models/Student.js";
import {
  calculateATSScore,
  calculateATSScoreFromResume,
} from "../services/geminiService.js";
import {
  createNotification,
  notificationTemplates,
} from "../services/notificationService.js";

// ==================== STUDENT CONTROLLERS ====================

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Student)
export const applyForJob = async (req, res) => {
  try {
    const studentId = req.user?.roleDoc?._id;
    const { jobId, coverLetter } = req.body;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message:
          "Student profile not found. Please complete your profile first.",
      });
    }
    // Check if job exists and is approved
    const job = await Job.findById(jobId).populate("recruiterId");
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.approvalStatus !== "approved") {
      return res.status(400).json({
        success: false,
        message: "This job is not available for applications",
      });
    }

    if (!job.isActive) {
      return res.status(400).json({
        success: false,
        message: "This job posting is no longer active",
      });
    }

    // Check application deadline
    if (
      job.applicationDeadline &&
      new Date(job.applicationDeadline) < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Application deadline has passed",
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({ jobId, studentId });
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // Get student profile for eligibility check
    const student = await Student.findById(studentId);

    // Check eligibility criteria
    const eligibility = job.eligibilityCriteria;

    // Check CGPA
    if (
      eligibility.minCGPA &&
      student.academicInfo?.cgpa < eligibility.minCGPA
    ) {
      return res.status(400).json({
        success: false,
        message: `Minimum CGPA required: ${eligibility.minCGPA}. Your CGPA: ${student.academicInfo?.cgpa || "Not set"}`,
      });
    }

    // Check backlogs
    if (
      eligibility.maxBacklogs !== undefined &&
      student.academicInfo?.backlogs > eligibility.maxBacklogs
    ) {
      return res.status(400).json({
        success: false,
        message: `Maximum backlogs allowed: ${eligibility.maxBacklogs}. Your backlogs: ${student.academicInfo?.backlogs}`,
      });
    }

    // Check branch
    if (
      eligibility.branches?.length > 0 &&
      !eligibility.branches.includes(student.academicInfo?.branch)
    ) {
      return res.status(400).json({
        success: false,
        message: `This job is only for branches: ${eligibility.branches.join(", ")}. Your branch: ${student.academicInfo?.branch}`,
      });
    }

    // Check graduation year
    if (
      eligibility.graduationYears?.length > 0 &&
      !eligibility.graduationYears.includes(
        student.academicInfo?.graduationYear,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: `This job is only for graduation years: ${eligibility.graduationYears.join(", ")}. Your year: ${student.academicInfo?.graduationYear}`,
      });
    }

    // Calculate ATS Score - PRIORITIZE RESUME if available
    let atsScoreData = null;
    try {
      console.log("\n🎯 === ATS CALCULATION START ===");

      // Check if student has uploaded resume with parsed data
      if (student.resume?.parsedData) {
        console.log(
          "📄 Student has parsed resume data - using resume-based ATS scoring",
        );

        // Convert parsed data to text for ATS analysis
        const resumeText = `
PERSONAL INFO:
Name: ${student.resume.parsedData.personalInfo?.name || "N/A"}
Email: ${student.resume.parsedData.personalInfo?.email || "N/A"}
Phone: ${student.resume.parsedData.personalInfo?.phone || "N/A"}

SKILLS:
${student.resume.parsedData.skills?.join(", ") || "None listed"}

EDUCATION:
${
  student.resume.parsedData.education
    ?.map(
      (edu) =>
        `${edu.degree} from ${edu.institution} (${edu.year}) - CGPA: ${edu.cgpa || "N/A"}`,
    )
    .join("\n") || "None listed"
}

EXPERIENCE:
${
  student.resume.parsedData.experience
    ?.map(
      (exp) =>
        `${exp.title} at ${exp.company} (${exp.duration})\n${exp.description}`,
    )
    .join("\n\n") || "None listed"
}

PROJECTS:
${
  student.resume.parsedData.projects
    ?.map(
      (proj) =>
        `${proj.title}: ${proj.description}\nTechnologies: ${proj.technologies?.join(", ") || "N/A"}`,
    )
    .join("\n\n") || "None listed"
}

CERTIFICATIONS:
${
  student.resume.parsedData.certifications
    ?.map((cert) => `${cert.name} by ${cert.issuer}`)
    .join("\n") || "None listed"
}
    `.trim();

        console.log("📝 Resume text prepared (first 300 chars):");
        console.log(resumeText.substring(0, 300) + "...\n");

        // Try resume-based scoring
        atsScoreData = await calculateATSScoreFromResume(resumeText, job);

        if (atsScoreData) {
          console.log(
            "✅ Resume-based ATS score calculated:",
            atsScoreData.score,
          );
        }
      } else {
        console.log("ℹ️ No resume data available");
      }

      // Fallback to profile-based scoring if resume scoring failed
      if (!atsScoreData) {
        console.log("📊 Using profile-based ATS scoring (fallback)");
        console.log("Student profile:", {
          skills: student.skills?.length || 0,
          projects: student.projects?.length || 0,
          cgpa: student.academicInfo?.cgpa,
        });

        atsScoreData = await calculateATSScore(student, job);
        console.log(
          "✅ Profile-based ATS score calculated:",
          atsScoreData.score,
        );
      }

      console.log("\n📊 Final ATS Result:");
      console.log(JSON.stringify(atsScoreData, null, 2));
      console.log("🎯 === ATS CALCULATION END ===\n");
    } catch (error) {
      console.error("ATS calculation error:", error);
      // Continue even if ATS fails
    }

    // Create application
    const application = await Application.create({
      jobId,
      studentId,
      recruiterId: job.recruiterId._id,
      coverLetter,
      appliedAt: new Date(),
      atsScore: atsScoreData
        ? {
            score: atsScoreData.score,
            strengths: atsScoreData.strengths,
            weaknesses: atsScoreData.weaknesses,
            recommendation: atsScoreData.recommendation,
            calculatedAt: new Date(),
          }
        : undefined,
    });

    // Populate for response
    await application.populate([
      { path: "jobId", select: "title location jobType workMode salaryRange" },
      { path: "studentId", select: "personalInfo academicInfo" },
    ]);

    // NOTIFY RECRUITER OF NEW APPLICATION
    const studentName = `${student.personalInfo?.firstName} ${student.personalInfo?.lastName}`;
    const recruiterUserId = await job.recruiterId.populate("userId");
    const notificationData = notificationTemplates.newApplication(
      studentName,
      job.title,
    );

    await createNotification({
      userId: recruiterUserId.userId._id,
      userRole: "recruiter",
      ...notificationData,
      relatedJob: job._id,
      relatedApplication: application._id,
      actionUrl: `/recruiter/jobs/${job._id}/applications`,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      application,
      atsScore: atsScoreData,
    });
  } catch (error) {
    console.error("Apply for job error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit application",
    });
  }
};

// @desc    Get student's applications
// @route   GET /api/applications/my-applications
// @access  Private (Student)
export const getMyApplications = async (req, res) => {
  try {
    const studentId = req.user.roleDoc._id;
    const { status } = req.query;

    const filter = { studentId };
    if (status) {
      filter.status = status;
    }

    const applications = await Application.find(filter)
      .populate({
        path: "jobId",
        select:
          "title location jobType workMode salaryRange applicationDeadline",
        populate: {
          path: "recruiterId",
          select: "companyInfo",
        },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get my applications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};

// @desc    Get single application details
// @route   GET /api/applications/:id
// @access  Private (Student)
export const getApplicationById = async (req, res) => {
  try {
    const studentId = req.user.roleDoc._id;

    const application = await Application.findById(req.params.id)
      .populate({
        path: "jobId",
        populate: {
          path: "recruiterId",
          select: "companyInfo contactPerson",
        },
      })
      .populate("studentId", "personalInfo academicInfo skills");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Check ownership
    if (application.studentId._id.toString() !== studentId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this application",
      });
    }

    res.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Get application by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch application",
    });
  }
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private (Student)
export const withdrawApplication = async (req, res) => {
  try {
    const studentId = req.user.roleDoc._id;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Check ownership
    if (application.studentId.toString() !== studentId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to withdraw this application",
      });
    }

    // Can't withdraw if already shortlisted or selected
    if (["shortlisted", "selected"].includes(application.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot withdraw application that is ${application.status}`,
      });
    }

    await Application.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Application withdrawn successfully",
    });
  } catch (error) {
    console.error("Withdraw application error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to withdraw application",
    });
  }
};

// ==================== RECRUITER CONTROLLERS ====================

// @desc    Get applications for recruiter's jobs
// @route   GET /api/applications/recruiter/all
// @access  Private (Recruiter)
export const getRecruiterApplications = async (req, res) => {
  try {
    const recruiterId = req.user.roleDoc._id;
    const { jobId, status } = req.query;

    const filter = { recruiterId };
    if (jobId) filter.jobId = jobId;
    if (status) filter.status = status;

    const applications = await Application.find(filter)
      .populate({
        path: "studentId",
        select: "personalInfo academicInfo skills registrationNumber",
      })
      .populate({
        path: "jobId",
        select: "title location jobType",
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get recruiter applications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};

// @desc    Get applications for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter)
export const getJobApplications = async (req, res) => {
  try {
    const recruiterId = req.user.roleDoc._id;
    const { jobId } = req.params;
    const { status } = req.query;

    // Verify job belongs to recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.recruiterId.toString() !== recruiterId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view applications for this job",
      });
    }

    const filter = { jobId };
    if (status) filter.status = status;

    const applications = await Application.find(filter)
      .populate({
        path: "studentId",
        select:
          "personalInfo academicInfo skills projects internships certifications registrationNumber",
      })
      .sort({ createdAt: -1 });

    // Get stats
    const stats = {
      total: applications.length,
      applied: applications.filter((a) => a.status === "applied").length,
      shortlisted: applications.filter((a) => a.status === "shortlisted")
        .length,
      rejected: applications.filter((a) => a.status === "rejected").length,
      selected: applications.filter((a) => a.status === "selected").length,
    };

    res.json({
      success: true,
      stats,
      applications,
    });
  } catch (error) {
    console.error("Get job applications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};

// @desc    Update application status (shortlist/reject/select)
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter)
export const updateApplicationStatus = async (req, res) => {
  try {
    const recruiterId = req.user.roleDoc._id;
    const { status, recruiterNotes, rejectionReason } = req.body;

    // Validate status
    if (!["shortlisted", "rejected", "selected", "on-hold"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const application = await Application.findById(req.params.id)
      .populate("jobId")
      .populate("studentId");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Check if job belongs to recruiter
    if (application.jobId.recruiterId.toString() !== recruiterId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this application",
      });
    }

    // Validate rejection reason
    if (status === "rejected" && !rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    // Update status
    application.status = status;
    if (recruiterNotes) application.recruiterNotes = recruiterNotes;

    if (status === "shortlisted") {
      application.shortlistedAt = new Date();
      application.shortlistedBy = req.user.userId;
    } else if (status === "rejected") {
      application.rejectedAt = new Date();
      application.rejectionReason = rejectionReason;
    } else if (status === "selected") {
      application.selectedAt = new Date();
    }

    await application.save();

    await application.populate([
      {
        path: "studentId",
        select: "personalInfo academicInfo registrationNumber",
      },
      {
        path: "jobId",
        select: "title",
        populate: {
          path: "recruiterId",
          select: "companyInfo",
        },
      },
    ]);

    // CREATE NOTIFICATION FOR STUDENT
    const companyName =
      application.jobId.recruiterId?.companyInfo?.companyName || "Company";
    const jobTitle = application.jobId.title;
    const studentUserId = application.studentId.userId;

    let notificationData;
    let actionUrl = "/student/applications";

    if (status === "shortlisted") {
      notificationData = notificationTemplates.applicationShortlisted(
        jobTitle,
        companyName,
      );
    } else if (status === "rejected") {
      notificationData = notificationTemplates.applicationRejected(
        jobTitle,
        companyName,
      );
    } else if (status === "selected") {
      notificationData = notificationTemplates.applicationSelected(
        jobTitle,
        companyName,
      );
      actionUrl = `/student/jobs/${application.jobId._id}`;
    }

    if (notificationData) {
      await createNotification({
        userId: studentUserId,
        userRole: "student",
        ...notificationData,
        relatedJob: application.jobId._id,
        relatedApplication: application._id,
        actionUrl,
      });
    }

    res.json({
      success: true,
      message: `Application ${status} successfully`,
      application,
    });
  } catch (error) {
    console.error("Update application status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update application status",
    });
  }
};

// @desc    Bulk update application statuses
// @route   PUT /api/applications/bulk-update
// @access  Private (Recruiter)
export const bulkUpdateApplications = async (req, res) => {
  try {
    const recruiterId = req.user.roleDoc._id;
    const { applicationIds, status, recruiterNotes, rejectionReason } =
      req.body;

    if (!applicationIds || applicationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No applications selected",
      });
    }

    if (!["shortlisted", "rejected", "on-hold"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status for bulk update",
      });
    }

    // Verify all applications belong to recruiter
    const applications = await Application.find({
      _id: { $in: applicationIds },
    }).populate("jobId");

    const unauthorizedApps = applications.filter(
      (app) => app.jobId.recruiterId.toString() !== recruiterId.toString(),
    );

    if (unauthorizedApps.length > 0) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update some applications",
      });
    }

    // Update all
    const updateData = { status };
    if (recruiterNotes) updateData.recruiterNotes = recruiterNotes;

    if (status === "shortlisted") {
      updateData.shortlistedAt = new Date();
      updateData.shortlistedBy = req.user.userId;
    } else if (status === "rejected") {
      updateData.rejectedAt = new Date();
      if (rejectionReason) updateData.rejectionReason = rejectionReason;
    }

    await Application.updateMany({ _id: { $in: applicationIds } }, updateData);

    res.json({
      success: true,
      message: `${applicationIds.length} application(s) updated successfully`,
      count: applicationIds.length,
    });
  } catch (error) {
    console.error("Bulk update applications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update applications",
    });
  }
};

// ==================== ADMIN CONTROLLERS ====================

// @desc    Get all applications (admin)
// @route   GET /api/admin/applications
// @access  Private (Admin)
export const getAllApplicationsAdmin = async (req, res) => {
  try {
    const { status, jobId, studentId } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (jobId) filter.jobId = jobId;
    if (studentId) filter.studentId = studentId;

    const applications = await Application.find(filter)
      .populate({
        path: "studentId",
        select: "personalInfo registrationNumber",
      })
      .populate({
        path: "jobId",
        select: "title",
        populate: {
          path: "recruiterId",
          select: "companyInfo",
        },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Admin get all applications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};

// @desc    Recalculate ATS scores for a job and auto-shortlist
// @route   POST /api/applications/job/:jobId/calculate-scores
// @access  Private (Recruiter)
export const recalculateATSScores = async (req, res) => {
  try {
    const recruiterId = req.user.roleDoc._id;
    const { jobId } = req.params;
    const { autoShortlistThreshold = 70 } = req.body;

    // Verify job belongs to recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.recruiterId.toString() !== recruiterId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Get all applications for this job
    const applications = await Application.find({
      jobId,
      status: "applied",
    }).populate("studentId");

    let processed = 0;
    let shortlisted = 0;

    for (const app of applications) {
      try {
        // Calculate ATS score
        const atsScoreData = await calculateATSScore(app.studentId, job);

        // Update application
        app.atsScore = {
          score: atsScoreData.score,
          strengths: atsScoreData.strengths,
          weaknesses: atsScoreData.weaknesses,
          recommendation: atsScoreData.recommendation,
          calculatedAt: new Date(),
        };

        // Auto-shortlist if score is above threshold
        if (atsScoreData.score >= autoShortlistThreshold) {
          app.status = "shortlisted";
          app.shortlistedAt = new Date();
          app.shortlistedBy = req.user.userId;
          app.recruiterNotes = `Auto-shortlisted: ATS Score ${atsScoreData.score}%`;
          shortlisted++;
        }

        await app.save();
        processed++;
      } catch (error) {
        console.error(`Error processing application ${app._id}:`, error);
      }
    }

    res.json({
      success: true,
      message: `Processed ${processed} applications. ${shortlisted} auto-shortlisted.`,
      stats: {
        total: applications.length,
        processed,
        shortlisted,
      },
    });
  } catch (error) {
    console.error("Recalculate ATS scores error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to calculate ATS scores",
    });
  }
};

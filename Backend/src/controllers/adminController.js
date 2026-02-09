import Admin from "../models/Admin.js";
import Recruiter from "../models/Recruiter.js";
import Alumni from "../models/Alumni.js";
import Student from "../models/Student.js";
import User from "../models/User.js";
import { validatePhone } from "../utils/profileHelpers.js";
import {
  createNotification,
  notificationTemplates,
} from "../services/notificationService.js";

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private (Admin only)
export const getAdminProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const admin = await Admin.findOne({ userId }).populate(
      "userId",
      "email createdAt",
    );

    if (!admin) {
      return res.status(404).json({
        message: "Admin profile not found",
      });
    }

    res.json({
      profile: {
        email: admin.userId.email,
        name: admin.personalInfo.name,
        department: admin.personalInfo.department,
        phoneNumber: admin.personalInfo.phoneNumber,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get Admin Profile Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private (Admin only)
export const updateAdminProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, department, phoneNumber } = req.body;

    const admin = await Admin.findOne({ userId });

    if (!admin) {
      return res.status(404).json({
        message: "Admin profile not found",
      });
    }

    // Validate phone if provided
    if (phoneNumber && !validatePhone(phoneNumber)) {
      return res.status(400).json({
        message: "Invalid phone number format",
      });
    }

    // Update fields
    if (name) admin.personalInfo.name = name;
    if (department) admin.personalInfo.department = department;
    if (phoneNumber) admin.personalInfo.phoneNumber = phoneNumber;

    await admin.save();

    res.json({
      message: "Profile updated successfully",
      profile: {
        name: admin.personalInfo.name,
        department: admin.personalInfo.department,
        phoneNumber: admin.personalInfo.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Update Admin Profile Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ========== RECRUITER MANAGEMENT ==========

// @desc    Get all recruiters (with optional filters)
// @route   GET /api/admin/recruiters
// @access  Private (Admin only)
export const getAllRecruiters = async (req, res) => {
  try {
    const { verificationStatus, search } = req.query;

    // Build query
    let query = {};

    if (verificationStatus) {
      query.verificationStatus = verificationStatus;
    }

    if (search) {
      query["companyInfo.companyName"] = { $regex: search, $options: "i" };
    }

    const recruiters = await Recruiter.find(query)
      .populate("userId", "email createdAt isActive")
      .populate("verifiedBy", "personalInfo.name")
      .sort({ createdAt: -1 });

    res.json({
      recruiters: recruiters,
      total: recruiters.length,
    });
  } catch (error) {
    console.error("Get All Recruiters Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get pending recruiters
// @route   GET /api/admin/recruiters/pending
// @access  Private (Admin only)
export const getPendingRecruiters = async (req, res) => {
  try {
    const recruiters = await Recruiter.find({
      verificationStatus: "pending",
    })
      .populate("userId", "email createdAt")
      .sort({ createdAt: -1 });

    res.json({
      recruiters: recruiters,
      total: recruiters.length,
      message:
        recruiters.length === 0
          ? "No pending recruiters"
          : `${recruiters.length} recruiter(s) awaiting verification`,
    });
  } catch (error) {
    console.error("Get Pending Recruiters Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Verify recruiter (approve or reject)
// @route   PUT /api/admin/recruiters/:id/verify
// @access  Private (Admin only)
export const verifyRecruiter = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, verificationNotes, rejectionReason } = req.body;
    const adminId = req.user.userId;

    // Validate action
    if (!action || !["approve", "reject"].includes(action)) {
      return res.status(400).json({
        message: 'Invalid action. Must be "approve" or "reject"',
      });
    }

    // Find recruiter
    const recruiter = await Recruiter.findById(id).populate("userId", "email");

    if (!recruiter) {
      return res.status(404).json({
        message: "Recruiter not found",
      });
    }

    // Check if already verified
    if (recruiter.verificationStatus !== "pending") {
      return res.status(400).json({
        message: `Recruiter is already ${recruiter.verificationStatus}`,
      });
    }

    // Find admin
    const admin = await Admin.findOne({ userId: adminId });

    if (action === "approve") {
      // Approve recruiter
      recruiter.verificationStatus = "approved";
      recruiter.verifiedBy = admin._id;
      recruiter.verifiedAt = new Date();
      recruiter.verificationNotes = verificationNotes || "Approved by admin";
      recruiter.rejectionReason = "";

      // Activate user account
      await User.findByIdAndUpdate(recruiter.userId._id, {
        isActive: true,
        isVerified: true,
      });

      await recruiter.save();

      // CREATE NOTIFICATION - Recruiter Approved
      const notificationData = notificationTemplates.recruiterApproved();
      await createNotification({
        userId: recruiter.userId._id,
        userRole: "recruiter",
        ...notificationData,
        actionUrl: "/recruiter/dashboard",
      });

      res.json({
        message: `${recruiter.companyInfo.companyName} has been approved successfully`,
        recruiter: {
          id: recruiter._id,
          companyName: recruiter.companyInfo.companyName,
          email: recruiter.userId.email,
          verificationStatus: "approved",
          verifiedBy: admin.personalInfo.name,
          verifiedAt: recruiter.verifiedAt,
        },
      });
    } else if (action === "reject") {
      // Reject recruiter
      if (!rejectionReason) {
        return res.status(400).json({
          message: "Rejection reason is required",
        });
      }

      recruiter.verificationStatus = "rejected";
      recruiter.rejectionReason = rejectionReason;
      recruiter.verifiedBy = admin._id;
      recruiter.verifiedAt = new Date();

      // Keep user account inactive
      await User.findByIdAndUpdate(recruiter.userId._id, {
        isActive: false,
      });

      await recruiter.save();

      // CREATE NOTIFICATION - Recruiter Rejected
      const notificationData =
        notificationTemplates.recruiterRejected(rejectionReason);
      await createNotification({
        userId: recruiter.userId._id,
        userRole: "recruiter",
        ...notificationData,
        actionUrl: "/recruiter/dashboard",
      });

      res.json({
        message: `${recruiter.companyInfo.companyName} has been rejected`,
        recruiter: {
          id: recruiter._id,
          companyName: recruiter.companyInfo.companyName,
          email: recruiter.userId.email,
          verificationStatus: "rejected",
          rejectionReason: rejectionReason,
        },
      });
    }
  } catch (error) {
    console.error("Verify Recruiter Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ========== ALUMNI MANAGEMENT ==========

// @desc    Get all alumni (with optional filters)
// @route   GET /api/admin/alumni
// @access  Private (Admin only)
export const getAllAlumni = async (req, res) => {
  try {
    const { verificationStatus, search, branch, graduationYear } = req.query;

    // Build query
    let query = {};

    if (verificationStatus) {
      query.verificationStatus = verificationStatus;
    }

    if (search) {
      query.$or = [
        { "personalInfo.firstName": { $regex: search, $options: "i" } },
        { "personalInfo.lastName": { $regex: search, $options: "i" } },
        { registrationNumber: { $regex: search, $options: "i" } },
      ];
    }

    if (branch) {
      query["academicInfo.branch"] = branch;
    }

    if (graduationYear) {
      query["academicInfo.graduationYear"] = parseInt(graduationYear);
    }

    const alumni = await Alumni.find(query)
      .populate("userId", "email createdAt isActive")
      .populate("verifiedBy", "personalInfo.name")
      .sort({ createdAt: -1 });

    res.json({
      alumni: alumni,
      total: alumni.length,
    });
  } catch (error) {
    console.error("Get All Alumni Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get pending alumni
// @route   GET /api/admin/alumni/pending
// @access  Private (Admin only)
export const getPendingAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.find({
      verificationStatus: "pending",
    })
      .populate("userId", "email createdAt")
      .sort({ createdAt: -1 });

    res.json({
      alumni: alumni,
      total: alumni.length,
      message:
        alumni.length === 0
          ? "No pending alumni"
          : `${alumni.length} alumni awaiting verification`,
    });
  } catch (error) {
    console.error("Get Pending Alumni Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Verify alumni (approve or reject)
// @route   PUT /api/admin/alumni/:id/verify
// @access  Private (Admin only)
export const verifyAlumni = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, verificationNotes, rejectionReason } = req.body;
    const adminId = req.user.userId;

    // Validate action
    if (!action || !["approve", "reject"].includes(action)) {
      return res.status(400).json({
        message: 'Invalid action. Must be "approve" or "reject"',
      });
    }

    // Find alumni
    const alumni = await Alumni.findById(id).populate("userId", "email");

    if (!alumni) {
      return res.status(404).json({
        message: "Alumni not found",
      });
    }

    // Check if already verified
    if (alumni.verificationStatus !== "pending") {
      return res.status(400).json({
        message: `Alumni is already ${alumni.verificationStatus}`,
      });
    }

    // Find admin
    const admin = await Admin.findOne({ userId: adminId });

    if (action === "approve") {
      // Approve alumni
      alumni.verificationStatus = "approved";
      alumni.verifiedBy = admin._id;
      alumni.verifiedAt = new Date();
      alumni.verificationNotes = verificationNotes || "Approved by admin";
      alumni.rejectionReason = "";

      // Activate user account
      await User.findByIdAndUpdate(alumni.userId._id, {
        isActive: true,
        isVerified: true,
      });

      await alumni.save();

      // CREATE NOTIFICATION - Alumni Approved
      const notificationData = notificationTemplates.alumniApproved();
      await createNotification({
        userId: alumni.userId._id,
        userRole: "alumni",
        ...notificationData,
        actionUrl: "/alumni/dashboard",
      });

      res.json({
        message: `${alumni.personalInfo.firstName} ${alumni.personalInfo.lastName} has been approved successfully`,
        alumni: {
          id: alumni._id,
          name: `${alumni.personalInfo.firstName} ${alumni.personalInfo.lastName}`,
          email: alumni.userId.email,
          verificationStatus: "approved",
          verifiedBy: admin.personalInfo.name,
          verifiedAt: alumni.verifiedAt,
        },
      });
    } else if (action === "reject") {
      // Reject alumni
      if (!rejectionReason) {
        return res.status(400).json({
          message: "Rejection reason is required",
        });
      }

      alumni.verificationStatus = "rejected";
      alumni.rejectionReason = rejectionReason;
      alumni.verifiedBy = admin._id;
      alumni.verifiedAt = new Date();

      // Keep user account inactive
      await User.findByIdAndUpdate(alumni.userId._id, {
        isActive: false,
      });

      await alumni.save();

      // CREATE NOTIFICATION - Alumni Rejected
      const notificationData =
        notificationTemplates.alumniRejected(rejectionReason);
      await createNotification({
        userId: alumni.userId._id,
        userRole: "alumni",
        ...notificationData,
        actionUrl: "/alumni/dashboard",
      });

      res.json({
        message: `${alumni.personalInfo.firstName} ${alumni.personalInfo.lastName} has been rejected`,
        alumni: {
          id: alumni._id,
          name: `${alumni.personalInfo.firstName} ${alumni.personalInfo.lastName}`,
          email: alumni.userId.email,
          verificationStatus: "rejected",
          rejectionReason: rejectionReason,
        },
      });
    }
  } catch (error) {
    console.error("Verify Alumni Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ========== DASHBOARD STATISTICS ==========

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin only)
export const getDashboardStats = async (req, res) => {
  try {
    // Count students
    const totalStudents = await Student.countDocuments();
    const placedStudents = await Student.countDocuments({
      placementStatus: "placed",
    });
    const unplacedStudents = await Student.countDocuments({
      placementStatus: "unplaced",
    });

    // Count recruiters
    const totalRecruiters = await Recruiter.countDocuments();
    const pendingRecruiters = await Recruiter.countDocuments({
      verificationStatus: "pending",
    });
    const approvedRecruiters = await Recruiter.countDocuments({
      verificationStatus: "approved",
    });
    const rejectedRecruiters = await Recruiter.countDocuments({
      verificationStatus: "rejected",
    });

    // Count alumni
    const totalAlumni = await Alumni.countDocuments();
    const pendingAlumni = await Alumni.countDocuments({
      verificationStatus: "pending",
    });
    const verifiedAlumni = await Alumni.countDocuments({
      verificationStatus: "verified",
    });
    const rejectedAlumni = await Alumni.countDocuments({
      verificationStatus: "rejected",
    });

    // Calculate placement percentage
    const placementPercentage =
      totalStudents > 0
        ? ((placedStudents / totalStudents) * 100).toFixed(2)
        : 0;

    // Get package statistics (if any students are placed)
    let packageStats = {
      average: 0,
      highest: 0,
      lowest: 0,
    };

    if (placedStudents > 0) {
      const placedStudentsData = await Student.find({
        placementStatus: "placed",
        package: { $exists: true, $ne: null },
      }).select("package");

      const packages = placedStudentsData
        .map((s) => s.package)
        .filter((p) => p !== null && p !== undefined);

      if (packages.length > 0) {
        packageStats.average = (
          packages.reduce((a, b) => a + b, 0) / packages.length
        ).toFixed(2);
        packageStats.highest = Math.max(...packages);
        packageStats.lowest = Math.min(...packages);
      }
    }

    res.json({
      statistics: {
        students: {
          total: totalStudents,
          placed: placedStudents,
          unplaced: unplacedStudents,
          placementPercentage: parseFloat(placementPercentage),
        },
        recruiters: {
          total: totalRecruiters,
          pending: pendingRecruiters,
          approved: approvedRecruiters,
          rejected: rejectedRecruiters,
        },
        alumni: {
          total: totalAlumni,
          pending: pendingAlumni,
          verified: verifiedAlumni,
          rejected: rejectedAlumni,
        },
        packages: packageStats,
        pendingActions: {
          recruitersAwaitingVerification: pendingRecruiters,
          alumniAwaitingVerification: pendingAlumni,
          total: pendingRecruiters + pendingAlumni,
        },
      },
    });
  } catch (error) {
    console.error("Get Dashboard Stats Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get all students (for admin view)
// @route   GET /api/admin/students
// @access  Private (Admin only)
export const getAllStudents = async (req, res) => {
  try {
    const {
      search,
      branch,
      placementStatus,
      graduationYear,
      page = 1,
      limit = 20,
    } = req.query;

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { "personalInfo.firstName": { $regex: search, $options: "i" } },
        { "personalInfo.lastName": { $regex: search, $options: "i" } },
        { registrationNumber: { $regex: search, $options: "i" } },
      ];
    }

    if (branch) {
      query["academicInfo.branch"] = branch;
    }

    if (placementStatus) {
      query.placementStatus = placementStatus;
    }

    if (graduationYear) {
      query["academicInfo.graduationYear"] = parseInt(graduationYear);
    }

    // Execute query with pagination
    const students = await Student.find(query)
      .populate("userId", "email isActive")
      .sort({ "academicInfo.cgpa": -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Student.countDocuments(query);

    res.json({
      students: students,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalStudents: count,
    });
  } catch (error) {
    console.error("Get All Students Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

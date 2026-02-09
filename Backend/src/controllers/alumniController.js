import Alumni from "../models/Alumni.js";
import User from "../models/User.js";
import {
  calculateAlumniProfileCompletion,
  validatePhone,
  validateURL,
} from "../utils/profileHelpers.js";

// @desc    Get alumni profile
// @route   GET /api/alumni/profile
// @access  Private (Alumni only)
export const getAlumniProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const alumni = await Alumni.findOne({ userId })
      .populate("userId", "email createdAt isActive")
      .populate("verifiedBy", "personalInfo.name");

    if (!alumni) {
      return res.status(404).json({
        message: "Alumni profile not found",
      });
    }

    // Calculate profile completion
    const completionPercentage = calculateAlumniProfileCompletion(alumni);

    res.json({
      profile: {
        registrationNumber: alumni.registrationNumber,
        email: alumni.userId.email,
        personalInfo: alumni.personalInfo,
        academicInfo: alumni.academicInfo,
        currentRole: alumni.currentRole,
        externalLinks: alumni.externalLinks,
        socialLinks: alumni.socialLinks,
        verificationStatus: alumni.verificationStatus,
        verifiedBy: alumni.verifiedBy?.personalInfo?.name || null,
        verifiedAt: alumni.verifiedAt,
        isActive: alumni.userId.isActive,
        completionPercentage: completionPercentage,
        createdAt: alumni.createdAt,
        updatedAt: alumni.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get Alumni Profile Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Update alumni profile
// @route   PUT /api/alumni/profile
// @access  Private (Alumni only)
export const updateAlumniProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updateData = req.body;

    const alumni = await Alumni.findOne({ userId });

    if (!alumni) {
      return res.status(404).json({
        message: "Alumni profile not found",
      });
    }

    // Validate phone if provided
    if (updateData.personalInfo?.phoneNumber) {
      if (!validatePhone(updateData.personalInfo.phoneNumber)) {
        return res.status(400).json({
          message: "Invalid phone number format",
        });
      }
    }

    // Validate URLs in external links
    if (updateData.externalLinks && Array.isArray(updateData.externalLinks)) {
      for (const link of updateData.externalLinks) {
        if (link.url && !validateURL(link.url)) {
          return res.status(400).json({
            message: `Invalid URL: ${link.url}`,
          });
        }
      }
    }

    // Validate social links
    if (
      updateData.socialLinks?.linkedin &&
      !validateURL(updateData.socialLinks.linkedin)
    ) {
      return res.status(400).json({
        message: "Invalid LinkedIn URL",
      });
    }

    if (
      updateData.socialLinks?.twitter &&
      !validateURL(updateData.socialLinks.twitter)
    ) {
      return res.status(400).json({
        message: "Invalid Twitter URL",
      });
    }

    // Update fields
    if (updateData.personalInfo) {
      alumni.personalInfo = {
        ...alumni.personalInfo,
        ...updateData.personalInfo,
      };
    }

    if (updateData.currentRole) {
      alumni.currentRole = { ...alumni.currentRole, ...updateData.currentRole };
    }

    if (updateData.externalLinks) {
      alumni.externalLinks = updateData.externalLinks;
    }

    if (updateData.socialLinks) {
      alumni.socialLinks = { ...alumni.socialLinks, ...updateData.socialLinks };
    }

    await alumni.save();

    const completionPercentage = calculateAlumniProfileCompletion(alumni);

    res.json({
      message: "Profile updated successfully",
      profile: {
        personalInfo: alumni.personalInfo,
        currentRole: alumni.currentRole,
        externalLinks: alumni.externalLinks,
        socialLinks: alumni.socialLinks,
        completionPercentage: completionPercentage,
      },
    });
  } catch (error) {
    console.error("Update Alumni Profile Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

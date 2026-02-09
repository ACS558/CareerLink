import Student from "../models/Student.js";
import Recruiter from "../models/Recruiter.js";
import cloudinary from "../config/cloudinary.js";
import { parseResume } from "../services/geminiService.js";
import fs from "fs";

// @desc    Upload student photo
// @route   POST /api/upload/photo
// @access  Private (Student)
export const uploadStudentPhoto = async (req, res) => {
  try {
    const studentId = req.user.roleDoc._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "careerlink/student-photos",
      width: 500,
      height: 500,
      crop: "fill",
    });

    // Delete old photo if exists
    const student = await Student.findById(studentId);
    if (student.photo?.publicId) {
      await cloudinary.uploader.destroy(student.photo.publicId);
    }

    // Update student profile
    student.photo = {
      url: result.secure_url,
      publicId: result.public_id,
    };
    await student.save();

    // Delete local file
    fs.unlinkSync(req.file.path);

    console.log("✅ Photo uploaded:", result.secure_url); // Debug log

    res.json({
      success: true,
      message: "Photo uploaded successfully",
      photo: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error) {
    console.error("Upload photo error:", error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: "Failed to upload photo",
    });
  }
};

// @desc    Upload and parse resume
// @route   POST /api/upload/resume
// @access  Private (Student)
export const uploadResume = async (req, res) => {
  try {
    const studentId = req.user.roleDoc._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    console.log("📄 Resume upload started...");

    // Parse resume using Gemini
    let parsedData;
    try {
      console.log("🤖 Parsing resume with Gemini...");
      parsedData = await parseResume(req.file.path);
      console.log("✅ Resume parsed successfully!");
    } catch (parseError) {
      console.error("❌ Resume parsing failed:", parseError.message);
      // Continue even if parsing fails
    }

    // Upload to Cloudinary
    console.log("☁️ Uploading to Cloudinary...");
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "careerlink/resumes",
      resource_type: "raw",
    });

    // Delete old resume if exists
    const student = await Student.findById(studentId);
    if (student.resume?.publicId) {
      await cloudinary.uploader.destroy(student.resume.publicId, {
        resource_type: "raw",
      });
    }

    // Update student profile
    student.resume = {
      url: result.secure_url,
      publicId: result.public_id,
      uploadedAt: new Date(),
      parsedData: parsedData || null,
    };

    // Auto-populate fields from parsed data if available
    if (parsedData) {
      console.log("📝 Auto-filling profile from resume...");

      // Update skills
      if (parsedData.skills?.length > 0) {
        const newSkills = [
          ...new Set([...student.skills, ...parsedData.skills]),
        ];
        console.log(`Skills: ${student.skills.length} → ${newSkills.length}`);
        student.skills = newSkills;
      }

      // Update projects
      if (parsedData.projects?.length > 0) {
        console.log(`Adding ${parsedData.projects.length} projects`);
        parsedData.projects.forEach((proj) => {
          student.projects.push({
            title: proj.title,
            description: proj.description,
            technologies: proj.technologies || [],
          });
        });
      }

      // Update certifications
      if (parsedData.certifications?.length > 0) {
        console.log(
          `Adding ${parsedData.certifications.length} certifications`,
        );
        parsedData.certifications.forEach((cert) => {
          student.certifications.push({
            name: cert.name,
            issuedBy: cert.issuer,
          });
        });
      }
    }

    await student.save();

    // Delete local file
    fs.unlinkSync(req.file.path);

    console.log("✅ Resume upload complete!\n");

    res.json({
      success: true,
      message: "Resume uploaded and parsed successfully",
      resume: {
        url: result.secure_url,
        publicId: result.public_id,
        uploadedAt: new Date(),
        parsedData: parsedData || null,
      },
      parsedData: parsedData,
    });
  } catch (error) {
    console.error("Upload resume error:", error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: "Failed to upload resume",
    });
  }
};

// @desc    Upload company logo
// @route   POST /api/upload/logo
// @access  Private (Recruiter)
export const uploadCompanyLogo = async (req, res) => {
  try {
    const recruiterId = req.user.roleDoc._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "careerlink/company-logos",
      width: 300,
      height: 300,
      crop: "fit",
    });

    // Delete old logo if exists
    const recruiter = await Recruiter.findById(recruiterId);
    if (recruiter.companyInfo?.companyLogo?.publicId) {
      await cloudinary.uploader.destroy(
        recruiter.companyInfo.companyLogo.publicId,
      );
    }

    // Update recruiter profile
    recruiter.companyInfo.companyLogo = {
      url: result.secure_url,
      publicId: result.public_id,
    };
    await recruiter.save();

    // Delete local file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: "Company logo uploaded successfully",
      logo: recruiter.companyInfo.companyLogo,
    });
  } catch (error) {
    console.error("Upload logo error:", error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({
      success: false,
      message: "Failed to upload logo",
    });
  }
};

// @desc    Delete student photo
// @route   DELETE /api/upload/photo
// @access  Private (Student)
export const deleteStudentPhoto = async (req, res) => {
  try {
    const studentId = req.user.roleDoc._id;
    const student = await Student.findById(studentId);

    if (!student.photo?.publicId) {
      return res.status(404).json({
        success: false,
        message: "No photo to delete",
      });
    }

    await cloudinary.uploader.destroy(student.photo.publicId);
    student.photo = undefined;
    await student.save();

    res.json({
      success: true,
      message: "Photo deleted successfully",
    });
  } catch (error) {
    console.error("Delete photo error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete photo",
    });
  }
};

// @desc    Delete resume
// @route   DELETE /api/upload/resume
// @access  Private (Student)
export const deleteResume = async (req, res) => {
  try {
    const studentId = req.user.roleDoc._id;
    const student = await Student.findById(studentId);

    if (!student.resume?.publicId) {
      return res.status(404).json({
        success: false,
        message: "No resume to delete",
      });
    }

    await cloudinary.uploader.destroy(student.resume.publicId, {
      resource_type: "raw",
    });
    student.resume = undefined;
    await student.save();

    res.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete resume error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete resume",
    });
  }
};

import User from "../models/User.js";
import Student from "../models/Student.js";
import Recruiter from "../models/Recruiter.js";
import Admin from "../models/Admin.js";
import Alumni from "../models/Alumni.js";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register Student
// @route   POST /api/auth/register/student
// @access  Public
export const registerStudent = async (req, res) => {
  try {
    const { email, password, name, registrationNumber } = req.body;

    // Validation
    if (!email || !password || !name || !registrationNumber) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    // Check if registration number already exists
    const existingStudent = await Student.findOne({
      registrationNumber: registrationNumber.toUpperCase(),
    });
    if (existingStudent) {
      return res.status(400).json({
        message: "Registration number already exists",
      });
    }

    // Create User
    const user = await User.create({
      email,
      password,
      role: "student",
      isVerified: true,
      isActive: true,
    });

    // Split name into first and last name
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    // Create Student profile
    const student = await Student.create({
      userId: user._id,
      registrationNumber: registrationNumber.toUpperCase(),
      personalInfo: {
        firstName,
        lastName,
      },
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: "Student registered successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        registrationNumber: student.registrationNumber,
      },
    });
  } catch (error) {
    console.error("Register Student Error:", error);
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// @desc    Register Recruiter
// @route   POST /api/auth/register/recruiter
// @access  Public
export const registerRecruiter = async (req, res) => {
  try {
    const {
      email,
      password,
      companyName,
      industry,
      website,
      companySize,
      location,
      description,
      contactPersonName,
      contactPersonDesignation,
      contactPersonPhone,
      contactPersonEmail,
    } = req.body;

    // Validation
    if (
      !email ||
      !password ||
      !companyName ||
      !industry ||
      !location ||
      !contactPersonName ||
      !contactPersonDesignation ||
      !contactPersonPhone ||
      !contactPersonEmail
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    // Create User (inactive until admin verifies)
    const user = await User.create({
      email,
      password,
      role: "recruiter",
      isVerified: false,
      isActive: false,
    });

    // Create Recruiter profile
    const recruiter = await Recruiter.create({
      userId: user._id,
      companyInfo: {
        companyName,
        industry,
        website: website || "",
        companySize: companySize || "",
        location,
        description: description || "",
      },
      contactPerson: {
        name: contactPersonName,
        designation: contactPersonDesignation,
        phoneNumber: contactPersonPhone,
        email: contactPersonEmail,
      },
      verificationStatus: "pending",
    });

    // Generate token (limited access)
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message:
        "Recruiter registered successfully. Awaiting admin verification.",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        companyName: recruiter.companyInfo.companyName,
      },
      verificationStatus: "pending",
    });
  } catch (error) {
    console.error("Register Recruiter Error:", error);
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// @desc    Register Admin
// @route   POST /api/auth/register/admin
// @access  Public (should be protected in production)
export const registerAdmin = async (req, res) => {
  try {
    const { email, password, name, department } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    // Create User (active immediately for admin)
    const user = await User.create({
      email,
      password,
      role: "admin",
      isVerified: true,
      isActive: true,
    });

    // Create Admin profile
    const admin = await Admin.create({
      userId: user._id,
      personalInfo: {
        name,
        department: department || "Training & Placement Cell",
      },
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: "Admin registered successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: admin.personalInfo.name,
      },
    });
  } catch (error) {
    console.error("Register Admin Error:", error);
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// @desc    Register Alumni
// @route   POST /api/auth/register/alumni
// @access  Public
export const registerAlumni = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      registrationNumber,
      branch,
      graduationYear,
      currentCompany,
      currentRole,
      experience,
    } = req.body;

    // Validation
    if (
      !email ||
      !password ||
      !name ||
      !registrationNumber ||
      !branch ||
      !graduationYear
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    // Check if registration number already exists
    const existingAlumni = await Alumni.findOne({
      registrationNumber: registrationNumber.toUpperCase(),
    });
    if (existingAlumni) {
      return res.status(400).json({
        message: "Registration number already exists",
      });
    }

    // Create User (inactive until admin verifies)
    const user = await User.create({
      email,
      password,
      role: "alumni",
      isVerified: false,
      isActive: false,
    });

    // Split name
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    // Create Alumni profile
    const alumni = await Alumni.create({
      userId: user._id,
      registrationNumber: registrationNumber.toUpperCase(),
      personalInfo: {
        firstName,
        lastName,
      },
      academicInfo: {
        branch,
        graduationYear,
      },
      currentRole: {
        company: currentCompany || "",
        designation: currentRole || "",
        experience: experience || 0,
      },
      verificationStatus: "pending",
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: "Alumni registered successfully. Awaiting admin verification.",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        registrationNumber: alumni.registrationNumber,
      },
      verificationStatus: "pending",
    });
  } catch (error) {
    console.error("Register Alumni Error:", error);
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { emailOrRegNo, password } = req.body;

    // Validation
    if (!emailOrRegNo || !password) {
      return res.status(400).json({
        message: "Please provide email/registration number and password",
      });
    }

    let user = null;

    // Check if input is email format
    const isEmail = /^\S+@\S+\.\S+$/.test(emailOrRegNo);

    if (isEmail) {
      // Login with email
      user = await User.findOne({ email: emailOrRegNo });
    } else {
      // Login with registration number (for students and alumni)
      const regNoUpper = emailOrRegNo.toUpperCase();

      // Check in Student collection
      const student = await Student.findOne({
        registrationNumber: regNoUpper,
      });

      if (student) {
        user = await User.findById(student.userId);
      } else {
        // Check in Alumni collection
        const alumni = await Alumni.findOne({
          registrationNumber: regNoUpper,
        });

        if (alumni) {
          user = await User.findById(alumni.userId);
        }
      }
    }

    // User not found
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        message: "Account is not verified yet. Please wait for admin approval.",
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
};

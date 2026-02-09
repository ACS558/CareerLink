import express from "express";
import {
  getAdminProfile,
  updateAdminProfile,
  getAllRecruiters,
  getPendingRecruiters,
  verifyRecruiter,
  getAllAlumni,
  getPendingAlumni,
  verifyAlumni,
  getDashboardStats,
  getAllStudents,
} from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { getAllApplicationsAdmin } from "../controllers/applicationController.js";
import {
  getAllJobsAdmin,
  getPendingJobs,
  verifyJob,
} from "../controllers/jobController.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(roleMiddleware(["admin"]));

// Profile routes
router.get("/profile", getAdminProfile);
router.put("/profile", updateAdminProfile);

// Recruiter management routes
router.get("/recruiters", getAllRecruiters);
router.get("/recruiters/pending", getPendingRecruiters);
router.put("/recruiters/:id/verify", verifyRecruiter);

// Alumni management routes
router.get("/alumni", getAllAlumni);
router.get("/alumni/pending", getPendingAlumni);
router.put("/alumni/:id/verify", verifyAlumni);

// Student management routes
router.get("/students", getAllStudents);

// Dashboard routes
router.get("/dashboard/stats", getDashboardStats);

// Job routes
router.get("/jobs", getAllJobsAdmin);
router.get("/jobs/pending", getPendingJobs);
router.put("/jobs/:id/verify", verifyJob);

// Application routes
router.get(
  "/applications",
  authMiddleware,
  roleMiddleware("admin"),
  getAllApplicationsAdmin,
);

export default router;

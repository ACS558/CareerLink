import express from "express";
const router = express.Router();
import {
  uploadStudentPhoto,
  uploadResume,
  uploadCompanyLogo,
  deleteStudentPhoto,
  deleteResume,
} from "../controllers/uploadController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import upload from "../middleware/upload.js";

// Student routes
router.post(
  "/photo",
  authMiddleware,
  roleMiddleware("student"),
  upload.single("photo"),
  uploadStudentPhoto,
);
router.post(
  "/resume",
  authMiddleware,
  roleMiddleware("student"),
  upload.single("resume"),
  uploadResume,
);
router.delete(
  "/photo",
  authMiddleware,
  roleMiddleware("student"),
  deleteStudentPhoto,
);
router.delete(
  "/resume",
  authMiddleware,
  roleMiddleware("student"),
  deleteResume,
);

// Recruiter routes
router.post(
  "/logo",
  authMiddleware,
  roleMiddleware("recruiter"),
  upload.single("logo"),
  uploadCompanyLogo,
);

export default router;

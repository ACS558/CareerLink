import express from "express";
import {
  getStudentProfile,
  updateStudentProfile,
  getProfileCompletion,
} from "../controllers/studentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// All routes require authentication and student role
router.use(authMiddleware);
router.use(roleMiddleware(["student"]));

// Profile routes
router.get("/profile", getStudentProfile);
router.put("/profile", updateStudentProfile);
router.get("/profile/completion", getProfileCompletion);

export default router;

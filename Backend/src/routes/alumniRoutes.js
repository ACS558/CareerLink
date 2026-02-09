import express from "express";
import {
  getAlumniProfile,
  updateAlumniProfile,
} from "../controllers/alumniController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// All routes require authentication and alumni role
router.use(authMiddleware);
router.use(roleMiddleware(["alumni"]));

// Profile routes
router.get("/profile", getAlumniProfile);
router.put("/profile", updateAlumniProfile);

export default router;

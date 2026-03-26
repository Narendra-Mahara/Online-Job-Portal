import { Router } from "express";
import { isJobseeker, jwtVerify } from "../middleware/auth.middleware.js";
import {
  createResume,
  deleteResume,
} from "../controllers/resume.controller.js";

const router = Router();

router.route("/create").post(jwtVerify, isJobseeker, createResume);
router.route("/delete/:resumeId").delete(jwtVerify, isJobseeker, deleteResume);
export default router;

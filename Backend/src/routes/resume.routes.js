import { Router } from "express";
import { isJobseeker, jwtVerify } from "../middleware/auth.middleware.js";
import { createResume } from "../controllers/resume.controller.js";
const router = Router();

router.route("/create").post(jwtVerify, isJobseeker, createResume);
export default router;

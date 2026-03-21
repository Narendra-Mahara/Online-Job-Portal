import { Router } from "express";
import { createJob, getAllJobs } from "../controllers/job.controller.js";
import { isEmployer, jwtVerify } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/create").post(jwtVerify, isEmployer, createJob);
router.route("/").get(getAllJobs);

export default router;

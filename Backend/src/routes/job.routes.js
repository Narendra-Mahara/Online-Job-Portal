import { Router } from "express";
import {
  createJob,
  getAllJobs,
  getEmployerJob,
  getJobById,
  updateJobStatus,
} from "../controllers/job.controller.js";
import { isEmployer, jwtVerify } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/create").post(jwtVerify, isEmployer, createJob);
router.route("/").get(getAllJobs);
router.route("/employer-job").get(jwtVerify, isEmployer, getEmployerJob);
router.route("/update/:id").put(jwtVerify, isEmployer, updateJobStatus);
router.route("/:id").get(getJobById);
export default router;

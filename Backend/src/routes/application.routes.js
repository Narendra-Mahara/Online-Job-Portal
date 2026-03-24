import Router from "express";
import {
  applyForJob,
  getMyApplications,
  getApplicationsByJob,
  updateApplicationStatus,
} from "../controllers/application.controller.js";
import {
  isEmployer,
  isJobseeker,
  jwtVerify,
} from "../middleware/auth.middleware.js";

const router = Router();

router.route("/apply/:id").post(jwtVerify, isJobseeker, applyForJob);
router.route("/my-applications").get(jwtVerify, isJobseeker, getMyApplications);
router.route("/job/:id").get(jwtVerify, isEmployer, getApplicationsByJob);
router.route("/update/:id").put(jwtVerify, isEmployer, updateApplicationStatus);
export default router;

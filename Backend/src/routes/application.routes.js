import Router from "express";
import {
  applyForJob,
  getMyApplications,
} from "../controllers/application.controller.js";
import {
  isJobseeker,
  jwtVerify,
} from "../middleware/auth.middleware.js";

const router = Router();

router.route("/apply/:id").post(jwtVerify, isJobseeker, applyForJob);
router.route("/my-applications").get(jwtVerify, isJobseeker, getMyApplications);
export default router;

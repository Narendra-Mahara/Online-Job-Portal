import Router from "express";
import { applyForJob } from "../controllers/application.controller.js";
import { isJobseeker, jwtVerify } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/apply/:id").post(jwtVerify, isJobseeker, applyForJob);
export default router;

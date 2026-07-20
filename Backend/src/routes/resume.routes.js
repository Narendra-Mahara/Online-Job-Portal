import { Router } from "express";
import { isJobseeker, jwtVerify } from "../middleware/auth.middleware.js";
import {
  createResume,
  deleteResume,
  getResume,
  getResumeById,
  uploadResume,
} from "../controllers/resume.controller.js";
import { uploadPdf } from "../middleware/pdfUpload.middleware.js";

const router = Router();

router.route("/create").post(jwtVerify, isJobseeker, createResume);
router.route("/delete/:resumeId").delete(jwtVerify, isJobseeker, deleteResume);
router.route("/get-resume").get(jwtVerify, isJobseeker, getResume);
router
  .route("/upload-pdf")
  .post(jwtVerify, isJobseeker, uploadPdf.single("resume"), uploadResume);
router.route("/:id").get(jwtVerify, isJobseeker, getResumeById);
export default router;

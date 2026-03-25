import Router from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  updateProfile,
  deleteUser,
} from "../controllers/user.controller.js";
import { jwtVerify } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(jwtVerify, logoutUser);
router
  .route("/update-profile")
  .post(jwtVerify, upload.single("profileImage"), updateProfile);
router.route("/delete").delete(jwtVerify, deleteUser);
export default router;

import Router from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  updateProfile,
  deleteUser,
  getUser,
  refreshAccessToken,
} from "../controllers/user.controller.js";
import { jwtVerify } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(jwtVerify, getUser);
router.route("/logout").post(jwtVerify, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router
  .route("/update-profile")
  .post(jwtVerify, upload.single("profileImage"), updateProfile);
router.route("/delete").delete(jwtVerify, deleteUser);
export default router;

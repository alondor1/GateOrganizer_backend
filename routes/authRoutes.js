import express from "express";
import {
  login,
  forgotPassword,
  resetPassword,
  validateToken,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/password-reset/:token", resetPassword);
router.get("/validate-token/:token", validateToken);

export default router;

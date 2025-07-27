import express from "express";
import {
  signup,
  login,
  verifyEmail,
  protect,
  logOut,
} from "../controllers/authController.js";

const router = express.Router();
// Define routes for user authentication
router.post("/signup", signup);
router.post("/login", login);
router.get("/verify/:token", verifyEmail);
router.get("/logout", logOut);
router.get("/test", protect, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "You are authenticated and can access this route.",
  });
});

export default router;

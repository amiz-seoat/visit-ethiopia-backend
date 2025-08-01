import express from "express";
import {
  signup,
  login,
  verifyEmail,
  protect,
  logOut,
  forgotPassword,
  resetPassword,
  updatePassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify/:token", verifyEmail);
router.post("/logout", logOut);

router.patch("/updatePassword", protect, updatePassword);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

// ✅ Test route (protected)
router.get("/test", protect, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "You are authenticated and can access this route.",
  });
});

export default router;

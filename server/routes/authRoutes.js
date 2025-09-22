const express = require("express");
const router = express.Router();
const {
  loginUser,
  logoutUser,
  forgotPassword,
  verifyOtpCheck,
  verifyOtpAndReset,
  verifyotp,
  logDevice,
  resendOtp,
} = require("../controllers/authController"); // Or move these to a separate `authController`
const { authMiddleware } = require("../middleware/auth.js");

// Login
router.post("/login", loginUser);

// Logout
router.post("/logout", logoutUser);

// Forgot password (send OTP)
router.post("/forgot-password", forgotPassword);

// after forgot  check otp
router.post("/verify-otp-reset-check", verifyOtpCheck);


// Verify OTP and reset password
router.post("/verify-otp-reset", verifyOtpAndReset);

router.post("/verify-otp", verifyotp);

router.post("/log-device", authMiddleware, logDevice);

router.post("/resend-otp", resendOtp);

module.exports = router;

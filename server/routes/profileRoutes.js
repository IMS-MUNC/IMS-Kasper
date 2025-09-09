const express = require("express");
const router = express.Router();
const {
  createUserProfile,
  getUserProfile,
  updateUserProfile
} = require("../controllers/profileController");
const  {authMiddleware}=require("../middleware/auth.js")

// Add middleware like verifyToken if needed
router.post("/", authMiddleware,createUserProfile); // Create profile
router.get("/:userId",authMiddleware, getUserProfile); // Get profile by userId
router.put("/:userId",authMiddleware, updateUserProfile); // Update profile

module.exports = router;

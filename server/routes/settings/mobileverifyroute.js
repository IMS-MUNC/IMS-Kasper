const express = require("express")
const mobileverifyrouter = express.Router();
const {sendOtp, verifyOtp} = require("../../controllers/settings/MobileVerificationController.js")
const { authMiddleware } = require("../../middleware/auth.js")

mobileverifyrouter.post("/send-otp",authMiddleware, sendOtp)
mobileverifyrouter.post("/verify-otp", authMiddleware,  verifyOtp)


module.exports = mobileverifyrouter;



// note its database collection name mobileverifyotpsecurities
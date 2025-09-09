const express = require("express")
const emailverifyroute = express.Router();
const {sendOtp, verifyOtp} = require("../../controllers/settings/EmailVerificationcontroller.js")

emailverifyroute.post("/send-otp", sendOtp)
emailverifyroute.post("/verify-otp", verifyOtp)

module.exports = emailverifyroute;
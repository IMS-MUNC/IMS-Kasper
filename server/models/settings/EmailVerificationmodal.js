const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true }
},
{ timestamps: true }
);

const EmailVerificationModal = mongoose.model("emailverifyotpsecurity", otpSchema)

module.exports = EmailVerificationModal;
const mongoose = require("mongoose")

const mobileOtpSchema = new mongoose.Schema({
    mobile: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt:{type:Date, required:true}
},
{ timestamps: true }
)

const MobileVerificationModal = mongoose.model("MobileverifyOtpsecurity", mobileOtpSchema)

module.exports = MobileVerificationModal;
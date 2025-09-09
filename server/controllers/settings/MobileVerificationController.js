const MobileVerificationModal = require("../../models/settings/MobileVerificationModal.js");
const User = require("../../models/usersModels.js")
const fast2sms = require("fast-two-sms");

const sendOtp = async (req, res) => {
  const { mobile } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60000); //5 min

  try {
    await MobileVerificationModal.create({ mobile, otp, expiresAt });

    // send sms using fast2sms
    const options = {
      authorization: process.env.SMS_API_KEY,
      message: `Your OTP is ${otp}`, //it is valid for 5 min
      numbers: [mobile],
    };
    await fast2sms.sendMessage(options);
    res.status(200).json({ message: "OTP sent via SMS" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  const { mobile, otp } = req.body;
  const userId = req.user._id;

  try {
    const record = await MobileVerificationModal.findOne({ mobile }).sort({
      createdAt: -1,
    });
    if (!record) return res.status(404).json({ error: "OTP not found" });
    // console.log("Stored OTP:", record.otp);
    // console.log("Received OTP:", otp);

    if (record.otp !== otp)
      return res.status(400).json({ error: "Invalid OTP" });
    if (record.expiresAt < new Date())
      return res.status(400).json({ error: "OTP expired" });

    // update mobile number in user's profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { mobile, phoneVerified:true },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    await MobileVerificationModal.deleteMany({ mobile });
    res.status(200).json({ message: "Mobile number verified and updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { sendOtp, verifyOtp };

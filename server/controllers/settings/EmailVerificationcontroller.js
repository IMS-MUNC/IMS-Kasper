const EmailVerificationModal = require("../../models/settings/EmailVerificationmodal.js");
const User = require("../../models/usersModels.js");
const nodemailer = require("nodemailer");

const sendOtp = async (req, res) => {
  const { newEmail } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60000); //5 min

  try {
    // save otp to database
    await EmailVerificationModal.create({ email: newEmail, otp, expiresAt });
    // send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
    rejectUnauthorized: false, // <--- ADD THIS LINE
  },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: newEmail,
      subject: "verify your Email",
      html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes</p>`,
    });
    res.status(200).json({ message: "OTP Sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  const { newEmail, otp, currentEmail } = req.body;
  try {
    const record = await EmailVerificationModal.findOne({
      email: newEmail,
    }).sort({ createdAt: -1 });
    if (!record) return res.status(404).json({ error: "OTP not found" });
    if (record.otp !== otp)
      return res.status(404).json({ error: "Invalid OTP" });
    if (record.expiresAt < new Date())
      return res.status(400).json({ error: "OTP expired" });

    // update user email in userprofile collection
    const updatedUser = await User.findOneAndUpdate(
      { email: currentEmail },
      { email: newEmail, emailVerified: true },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    await EmailVerificationModal.deleteMany({ email: newEmail });
    res.status(200).json({ message: "Email verified and updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { sendOtp, verifyOtp };

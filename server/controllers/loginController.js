const User = require("../Modals/userModal.js");
const bcrypt = require("bcryptjs");
const sendEmail = require("../config/sendEmail.js");
const DeviceSession = require("../Modals/DeviceManagementmodal.js");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  const jwt = require("jsonwebtoken");

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password is required" });
    }
    // check user exist
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.isActive) {
      return res
        .status(403)
        .json({ message: "Account is deactivated contact support" });
    }
    if (!password || !user.password) {
      return res
        .status(400)
        .json({ message: "Password not set for this user" });
    }
    console.log("Received password:", password);
    console.log("User from db", user);
    console.log("Hashed password from DB:", user?.password);

    const isPasswordValid = await bcrypt.compare(
      String(password),
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // Genertate OTP
    if (user.twoFactorEnabled) {
      const otp = Math.floor(100000 + Math.random() * 900000);
      const hashedOtp = await bcrypt.hash(String(otp), 10);
      const expiry = Date.now() + 5 * 60 * 1000;
      user.otp = hashedOtp;
      user.otpExpires = expiry;
      await user.save();

      await sendEmail(email, "your Login OTP", `your OTP code is: ${otp}`);
      return res.status(200).json({
        message: "OTP sent to your email",
        twoFactor: true,
        email: user.email,
      });
    }
    // if no two factor needed
    return res.status(200).json({
      message: "Login Successful!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login unsuccess", error);
    return res.status(500).json({ message: "Login unsuccessful" });
  }
};

const verifyotp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) return res.status(404).json({ message: "User not found" });
    // compare otp and expiry
    const isOtpValid = await bcrypt.compare(String(otp), user.otp);
    if (!isOtpValid || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    // clear otp value after success
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // send response back
    res.status(200).json({
      message: "OTP Verified successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during otp verification" });
    console.error("OTP verification error", error);
  }
};

const logDevice = async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;
    let ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "")
      .split(",")[0]
      .trim();
    const userAgent = req.headers["user-agent"];
    let device = "Unknown";
    try {
      const browserName = userAgent.split("/")[0];
      const osMatch = userAgent.match(/\(([^)]+)\)/);
      const os = osMatch ? osMatch[1].split(";")[0].trim() : "Unknown";
      device = `${browserName} ${os.split(" ")[0]}`;
    } catch (error) {
      console.error("Error parsing user-agent", error.message);
    }
    let location = "Unknown";
    if (ip === "::1" || ip === "::ffff:127.0.0.1") {
      ip = "127.0.0.1";
      location = "Localhost / Dev";
    } else {
      try {
        const { data } = await axios.get(`https://ipapi.co/${ip}/json/`);
        location = `${data.city}, ${data.region}, ${data.country_name}`;
      } catch (error) {
        console.log("IP location failed:", error.message);
      }
    }
    console.log("Creating device log for:", {
      userId,
      ip,
      location,
      latitude,
      longitude,
      device,
    });

    await DeviceSession.create({
      userId,
      device,
      ipAddress: ip,
      location,
      latitude,
      longitude,
    });
    console.log("Device log saved successfully");
    res.status(200).json({ message: "Device logged" });
  } catch (error) {
    console.error("Log Device Error", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { loginUser, verifyotp, logDevice };

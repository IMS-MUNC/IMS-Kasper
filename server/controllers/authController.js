const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/usersModels");
const Otp = require("../models/otpModels");
const sendEmail = require("../utils/sendEmail");
// const sendEmail = require("../config/")
const axios = require("axios")
const DeviceSession = require("../models/settings/DeviceManagementmodal")

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  
  try {
    const user = await User.findOne({ email:email.toLowerCase() }).populate("role");

    if (!user) return res.status(404).json({ message: "User not found" });

    // 🚫 Prevent inactive users from logging in

    if (user.status === "Inactive") {
      return res.status(403).json({ message: "Your account is inactive. Please contact admin." });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });
    const roleData = user.role
      ? {
          roleName: user.role.roleName,
          modulePermissions: Object.fromEntries(user.role.modulePermissions || []),
        }
      : null;

    const tokenPayload = {
      id: user._id,
      email: user.email,
      role: roleData,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Generate OTP
    if(user.twoFactorEnabled) {
      const otp = Math.floor(100000 + Math.random() * 900000);
      const expiry = Date.now() + 5 * 60 * 1000;
      user.otp = otp;
      user.otpExpires = expiry;
      await user.save();

      await sendEmail(email, "your Login OTP", `your OTP code is: ${otp}`)
      return res.status(200).json({
          message: "OTP sent to your email",
        twoFactor: true,
        email: user.email,
      })
    }

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        status: user.status,
        role: roleData,
      },
    });
  } catch (err) {
  console.error("Login error:", err.message); // Print error message
  console.error(err.stack); // Print stack trace
  res.status(500).json({
    message: "Server error",
    error: err.message,  // Show actual error in response
  });
}
};


// LOGOUT
exports.logoutUser = async (req, res) => {
  try {
    // For JWT, you usually handle logout on client side
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const normalizedEmail = email.toLowerCase()
    const user = await User.findOne({ email:normalizedEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Allow max 3 OTPS/hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentOtps = await Otp.find({
      email: normalizedEmail,
      createdAt: { $gte: oneHourAgo }
    });
    if (recentOtps.length >= 3) {
      return res.status(429).json({message:"Too many OTP requests. Try again later"})
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email });

    const otp = new Otp({ email:normalizedEmail, otp: otpCode });
    await otp.save();

    await sendEmail(normalizedEmail, "OTP for Password Reset", `Your OTP is: ${otpCode}`);

    res.status(200).json({ message: "OTP sent to registered email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// VERIFY OTP & RESET PASSWORD
exports.verifyOtpAndReset = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) return res.status(400).json({ message: "Invalid or expired OTP" });

    const user = await User.findOne({ email:email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await Otp.deleteMany({ email });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// this is for two factor auth

exports.verifyotp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).populate("role");

    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare otp and check expiry
    if (String(user.otp) !== String(otp) || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clear OTP after verification
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const roleData = user.role
      ? {
          roleName: user.role.roleName,
          modulePermissions: Object.fromEntries(user.role.modulePermissions || []),
        }
      : null;

    const tokenPayload = {
      id: user._id,
      email: user.email,
      role: roleData,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "OTP Verified successfully",
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        status: user.status,
        role: roleData,
      },
    });
  } catch (error) {
    console.error("OTP verification error", error);
    res.status(500).json({ message: "Server error during OTP verification" });
  }
};



//this is for login device maintain location
exports.logDevice = async (req, res) => {
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
      console.error("Error parsing user-agent", e.message);
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



// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const User = require("../models/usersModels");
// const Otp = require("../models/otpModels");
// const sendEmail = require("../utils/sendEmail");

// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

  
//   try {
//     const user = await User.findOne({ email }).populate("role");

//     if (!user) return res.status(404).json({ message: "User not found" });

//     // 🚫 Prevent inactive users from logging in

//     if (user.status === "Inactive") {
//       return res.status(403).json({ message: "Your account is inactive. Please contact admin." });
//     }
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(400).json({ message: "Invalid credentials" });
//     const roleData = user.role
//       ? {
//           roleName: user.role.roleName,
//           modulePermissions: Object.fromEntries(user.role.modulePermissions || []),
//         }
//       : null;

//     const tokenPayload = {
//       id: user._id,
//       email: user.email,
//       role: roleData,
//     };

//     const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         phone: user.phone,
//         profileImage: user.profileImage,
//         status: user.status,
//         role: roleData,
//       },
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// // LOGOUT
// exports.logoutUser = async (req, res) => {
//   try {
//     // For JWT, you usually handle logout on client side
//     res.status(200).json({ message: "Logout successful" });
//   } catch (error) {
//     console.error("Logout Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // FORGOT PASSWORD
// exports.forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

//     await Otp.deleteMany({ email });

//     const otp = new Otp({ email, otp: otpCode });
//     await otp.save();

//     await sendEmail(email, "OTP for Password Reset", `Your OTP is: ${otpCode}`);

//     res.status(200).json({ message: "OTP sent to registered email" });
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// // VERIFY OTP & RESET PASSWORD
// exports.verifyOtpAndReset = async (req, res) => {
//   const { email, otp, newPassword } = req.body;

//   try {
//     const validOtp = await Otp.findOne({ email, otp });
//     if (!validOtp) return res.status(400).json({ message: "Invalid or expired OTP" });

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     user.password = await bcrypt.hash(newPassword, 10);
//     await user.save();

//     await Otp.deleteMany({ email });

//     res.status(200).json({ message: "Password reset successful" });
//   } catch (error) {
//     console.error("Error resetting password:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

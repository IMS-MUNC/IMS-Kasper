const jwt = require("jsonwebtoken");
const User = require("../../models/usersModels"); // adjust path

exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate("role").lean({virtuals:true}); // 👈 important to get permissions

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Block Inactive users
    if(user.status !== "Active") {
      return res.status(401).json({
        message:"You are currently set Inactive by admin or superadmin. Please contact admin.",
        logout:true, //tell frontend to clear storage
      })
    }

    //Convert Map -> Object
    // optional safety check - ensure modulePermissions is plain object
    if(user.role && user.role.modulePermissions && user.role.modulePermissions instanceof Map) {
      user.role.modulePermissions = Object.fromEntries(user.role.modulePermissions)
    }

    req.user = user; // 👈 attach full user with populated role
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

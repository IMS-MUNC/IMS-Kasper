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
    const user = await User.findById(decoded.id).populate("role"); // 👈 important to get permissions

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // 👈 attach full user with populated role
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

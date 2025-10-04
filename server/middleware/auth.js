

const jwt = require("jsonwebtoken");
const User = require("../models/usersModels");
exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("firstName lastName email");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

// exports.authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.header("Authorization")?.split(" ")[1]; // Expect "Bearer <token>"

//     if (!token) {
//       return res.status(401).json({ message: "No token, authorization denied" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     // Fetch full user from DB to get firstName, lastName, email
//     const user = await User.findById(decoded.id).select("firstName lastName email");
//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }
//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };




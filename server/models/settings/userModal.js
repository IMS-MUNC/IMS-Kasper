const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    isActive: {
      type: Boolean,
      default: true,
    },
    twoFactorEnabled: { type: Boolean, default: true },
    otp: { type: String },
    otpExpires:{type:Date},
  },
  {
    timestamps: true,
    collection: "users",
  }
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;

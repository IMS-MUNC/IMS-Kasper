const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    address: { type: String },
    postalcode: { type: Number },
    passwordChangedAt: {
      type: Date,
      default: Date.now,
    },
    // for profile image
    profileImage: {
      url: { type: String },
      public_id: { type: String },
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: String },
    resetPasswordOTP: { type: String },
    resetPasswordOTPExpires: { type: Date },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: "UserProfile" }, // connect to profile
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    resetToken: String,
    resetTokenExpire: Date,
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    // Two Factor authentication
    twoFactorEnabled: { type: Boolean, default: true },
    otp: { type: String },
    otpExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

// ✅ Keep _id and do NOT convert it to id
usersSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    return ret;
  },
});

module.exports = mongoose.model("Users", usersSchema);

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

    // ✅ Add this new field
trustedDevices: [
  {
    deviceId: { type: String },
    deviceInfo: { type: String },
    addedAt: { type: Date, default: Date.now },
  },
],

    // sessions or refresh tokens - for multi device logout
  refreshTokens: [
    {
    token:{type:String},
    deviceInfo:{type:String},
    createdAt: {type:Date, default:Date.now},
    },
  ],
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

// Helper method: check if password changed after JWT issued
usersSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if(this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp
  }
  //false means not changed
  return false;
}

usersSchema.methods.removeToken = async function (token) {
  this.refreshTokens = this.refreshTokens.filter(t => t.token !== token);
  await this.save();
};


module.exports = mongoose.model("Users", usersSchema);

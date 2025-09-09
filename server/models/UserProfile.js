const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true, unique: true },

  fullName: { type: String },
  contactNumber: { type: String },
  address: { type: String },
  dateOfBirth: { type: Date },
  profilePicture: { type: String }, // e.g. Cloudinary URL
  bio: { type: String },

}, { timestamps: true });

module.exports = mongoose.model("UserProfile", UserProfileSchema);

const UserProfile = require("../models/UserProfile");
const User = require("../models/usersModels");

// 👉 Create Profile
exports.createUserProfile = async (req, res, next) => {
  try {
    const { userId, fullName, contactNumber, address, dateOfBirth, profilePicture, bio } = req.body;

    // Check if profile already exists
    const existingProfile = await UserProfile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists for this user." });
    }

    const newProfile = new UserProfile({
      user: userId,
      fullName,
      contactNumber,
      address,
      dateOfBirth,
      profilePicture,
      bio,
    });

    const savedProfile = await newProfile.save();

    // Link profile to user
    await User.findByIdAndUpdate(userId, { profile: savedProfile._id });

    res.status(201).json(savedProfile);
  } catch (err) {
    next(err);
  }
};

// 👉 Get Profile by User ID
exports.getUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const profile = await UserProfile.findOne({ user: userId }).populate("user", "firstName lastName email");
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};

// 👉 Update Profile
exports.updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const updates = req.body;

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { user: userId },
      updates,
      { new: true }
    );

    if (!updatedProfile) return res.status(404).json({ message: "Profile not found" });

    res.status(200).json(updatedProfile);
  } catch (err) {
    next(err);
  }
};

const User = require("../../models/usersModels");
const bcrypt = require("bcryptjs");

// register user
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already created" });
    }
    const hashedPassword = await bcrypt.hash(String(password), 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Server error", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// get user
const getUser = async (req, res) => {
  try {
    const user = await User.find({});
    res.json(user);
  } catch (error) {
    console.error("Failed to fetch ", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// get single user
const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server side error" });
  }
};


// update user
const updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updated = await User.findByIdAndUpdate(req.params.id, {
      name,
      email,
      password,
    });
    if (!updated) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User updated", updated });
  } catch (error) {
    return res.status(500).json({ message: "Server side error" });
  }
};
//update user password
const updateUserProfile = async (req, res) => {
  const { name, email, currentpassword, newpassword, confirmpassword } =
    req.body;
  console.log("ilhlihlijhol", currentpassword, newpassword, confirmpassword);
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    //verify current password before making changes
    if (newpassword || confirmpassword) {
      if (!currentpassword) {
        return res.status(404).json({
          message: "Current password is required to change the password",
        });
      }
      const isMatch = await bcrypt.compare(currentpassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }
      if (newpassword !== confirmpassword) {
        return res.status(404).json({ message: "New passwords do not match" });
      }
      user.password = await bcrypt.hash(newpassword, 10);
    }
    if (name) user.name = name;
    if (email) user.email = email;
    console.log("New hashed password:", user.password);

    const updatedUser = await user.save();
    res.json({
      message: "Profile  updated successfully",
      updated: {
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};

const toggleAccountStatus = async (req, res) => {
  const { id } = req.params;
  console.log("Toggle status for user ID:", id);

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json({
      message: `Account ${
        user.isActive ? "reactivated" : "deactivated"
      } successfully`,
      isActive: user.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Two factor authentication
const toggleTwoFactor = async (req, res) => {
  try {
    const {id} = req.params
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({message:"User not found"})
    }
    user.twoFactorEnabled = !user.twoFactorEnabled
    await user.save();

    return res.status(200).json({
      message: `Two-factor authentication ${user.twoFactorEnabled ? "enabled" : "disabled"} successfully`,
      twoFactorEnabled: user.twoFactorEnabled,
    })
  } catch (error) {
    console.error("Toggle 2FA error", error)
    return res.status(500).json({message:"Server error"})
  }
}

//delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (error) {
    console.error("Error while deleting user", error);
    return res.status(500).json({ message: "Server side error" });
  }
};

module.exports = {
  createUser,
  getUser,
  getSingleUser,
  updateUser,
  updateUserProfile,
  toggleAccountStatus,
  deleteUser,
  toggleTwoFactor
};

const express = require("express");
const userrouter = express.Router();
const {
  createUser,
  getUser,
  getSingleUser,
  updateUser,
  updateUserProfile,
  deleteUser,
  toggleAccountStatus,
  toggleTwoFactor,
} = require("../Controller/userController.js");

userrouter.post("/register", createUser);
userrouter.get("/get", getUser);
userrouter.get("/single", getSingleUser);
userrouter.put("/update/:id", updateUser);
userrouter.put("/profile/:id", updateUserProfile);
userrouter.put("/toggle-status/:id", toggleAccountStatus);
userrouter.put("/toggle-2fa/:id",toggleTwoFactor);
userrouter.delete("/delete/:id", deleteUser);

module.exports = userrouter;

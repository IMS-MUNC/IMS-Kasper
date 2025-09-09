const express = require("express");
const loginrouter = express.Router();

const { loginUser, verifyotp, logDevice } = require("../Controller/loginController.js");

loginrouter.post("/login", loginUser);

// for two factor authentication
loginrouter.post("/verify-otp", verifyotp);

loginrouter.post("/log-device", logDevice);

module.exports = loginrouter;

const express = require("express");
const { verifyGoogleToken } = require("../../controllers/settings/authcontroller.js");
const authRouter = express.Router();
authRouter.post("/google", verifyGoogleToken);

module.exports = authRouter;

const express = require("express");
const auditrouter = express.Router();
const {getAuditLogs} = require("../controllers/auditController");
const { authMiddleware } = require("../middleware/auth.js");

auditrouter.get("/", authMiddleware, getAuditLogs);

module.exports = auditrouter;
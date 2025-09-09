const express = require("express");
const router = express.Router();
const moduleController = require("../controllers/moduleController");
const  {authMiddleware}=require("../middleware/auth.js")

// Create and fetch modules
router.post("/add",authMiddleware, moduleController.createModule);
router.get("/list",authMiddleware, moduleController.getModules);

module.exports = router;

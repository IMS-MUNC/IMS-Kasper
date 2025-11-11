// routes/unitRoutes.js
const express = require("express");
const router = express.Router();
const unitController = require("../controllers/unitsController");
const  {authMiddleware}=require("../middleware/auth.js")
const {verifyToken} = require("../middleware/Authentication/verifyToken.js")
const {checkPermission} = require("../middleware/permission/checkPermission.js")


router.post("/units", verifyToken, checkPermission("Unit", "write"), authMiddleware, unitController.createUnit);
router.get("/units", verifyToken, checkPermission("Unit", "read"),authMiddleware, unitController.getUnits);
router.get("/units/:id",authMiddleware, unitController.getUnitById);
router.put("/units/:id", verifyToken, checkPermission("Unit", "update"), authMiddleware,unitController.updateUnit);
router.delete("/units/:id", verifyToken, checkPermission("Unit", "delete"),authMiddleware, unitController.deleteUnit);
// router.get("/units/active", unitController.getActiveUnits); 

router.get("/units/status/active",authMiddleware, unitController.getActiveUnits);

// 🔽 Get only active units (latest first)
// router.get("/units/active", unitController.getActiveUnits);


module.exports = router;
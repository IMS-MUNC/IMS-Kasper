// routes/unitRoutes.js
const express = require("express");
const router = express.Router();
const unitController = require("../controllers/unitsController");
const  {authMiddleware}=require("../middleware/auth.js")

router.post("/units",authMiddleware, unitController.createUnit);
router.get("/units",authMiddleware, unitController.getUnits);
router.get("/units/:id",authMiddleware, unitController.getUnitById);
router.put("/units/:id", authMiddleware,unitController.updateUnit);
router.delete("/units/:id",authMiddleware, unitController.deleteUnit);
// router.get("/units/active", unitController.getActiveUnits); 

router.get("/units/status/active",authMiddleware, unitController.getActiveUnits);

// 🔽 Get only active units (latest first)
// router.get("/units/active", unitController.getActiveUnits);


module.exports = router;
const express = require("express");
const { getVariant, createVariant, updateVariant, deleteVariant, getActiveVariants, getValuesByVariant } = require("../controllers/varientController");
const { authMiddleware } = require("../middleware/auth.js")
const { verifyToken } = require("../middleware/Authentication/verifyToken");
const { checkPermission } = require("../middleware/permission/checkPermission");
const router = express.Router();


// CRUD
router.get("/", verifyToken, checkPermission("HSN", "read"), authMiddleware, getVariant);
router.post("/", verifyToken, checkPermission("HSN", "write"), authMiddleware, createVariant);
router.put("/:id", verifyToken, checkPermission("HSN", "update"), authMiddleware, updateVariant);
router.delete("/:id", verifyToken, checkPermission("HSN", "delete"), authMiddleware, deleteVariant);

// Dropdown endpoints
router.get("/active-variants", authMiddleware, getActiveVariants);
router.get("/values/:variant", authMiddleware, getValuesByVariant);

module.exports = router;
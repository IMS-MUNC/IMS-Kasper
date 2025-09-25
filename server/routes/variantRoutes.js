const express = require("express");
const { getVariant, createVariant, updateVariant, deleteVariant, getActiveVariants, getValuesByVariant } = require("../controllers/varientController");
const { authMiddleware } = require("../middleware/auth.js")


const router = express.Router();


// CRUD
router.get("/", authMiddleware, getVariant);
router.post("/", authMiddleware, createVariant);
router.put("/:id", authMiddleware, updateVariant);
router.delete("/:id", authMiddleware, deleteVariant);

// Dropdown endpoints
router.get("/active-variants", authMiddleware, getActiveVariants);
router.get("/values/:variant", authMiddleware, getValuesByVariant);

module.exports = router;
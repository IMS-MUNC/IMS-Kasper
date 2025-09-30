const express = require("express");
const router = express.Router();
const {
    addGst,
    getAllGst,
    updateGst,
    deleteGst,
    bulkImportGst
} = require("../controllers/gstController.js");
const { authMiddleware } = require("../middleware/auth.js");

// POST - Create GST
router.post("/", authMiddleware, addGst);

// GET - Read All GST
router.get("/",  getAllGst);

// PUT - Update GST
router.put("/:id", authMiddleware, updateGst);

// DELETE - Delete GST
router.delete("/:id", authMiddleware, deleteGst);

// POST - Bulk Import GST
router.post("/import", authMiddleware, bulkImportGst);

module.exports = router;

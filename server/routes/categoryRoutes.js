// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  bulkAssignCategoryCodes,
  bulkDeleteCategories
  //   getNextCategoryCode
} = require("../controllers/categoryController");
const { authMiddleware } = require("../middleware/auth.js")
const { verifyToken } = require("../middleware/Authentication/verifyToken");
const { checkPermission } = require("../middleware/permission/checkPermission");


router.post("/categories", verifyToken, checkPermission("Category", "write"), authMiddleware, createCategory);        // CREATE
router.get("/categories", verifyToken, checkPermission("Category", "read"), authMiddleware, getAllCategories);       // READ ALL
router.get("/categories/:id", authMiddleware, getCategoryById);    // READ ONE
router.put("/categories/:id", verifyToken, checkPermission("Category", "update"), authMiddleware, updateCategory);     // UPDATE
router.delete("/categories/:id", verifyToken, checkPermission("Category", "delete"), authMiddleware, deleteCategory);  // DELETE
// router.get("/next-category-code", getNextCategoryCode);
router.post("/bulk-assign-codes", authMiddleware, bulkAssignCategoryCodes);
router.post("/categories/bulk-delete", authMiddleware, bulkDeleteCategories);

module.exports = router;

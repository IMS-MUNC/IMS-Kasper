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
const  {authMiddleware}=require("../middleware/auth.js")


router.post("/categories", authMiddleware,createCategory);        // CREATE
router.get("/categories",authMiddleware, getAllCategories);       // READ ALL
router.get("/categories/:id",authMiddleware, getCategoryById);    // READ ONE
router.put("/categories/:id", authMiddleware,updateCategory);     // UPDATE
router.delete("/categories/:id",authMiddleware, deleteCategory);  // DELETE
// router.get("/next-category-code", getNextCategoryCode);
router.post("/bulk-assign-codes",authMiddleware, bulkAssignCategoryCodes);
router.post("/categories/bulk-delete",authMiddleware, bulkDeleteCategories);

module.exports = router;

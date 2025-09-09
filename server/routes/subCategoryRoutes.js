// 📁 routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/Multer/multer");
const { addSubcategory,getAllSubcategories,deleteSubcategory ,updateSubcategory,getSubcategoriesByCategory } = require("../controllers/subCategoryController");
const  {authMiddleware}=require("../middleware/auth.js")

router.post("/categories/:categoryId/subcategories", upload.array("images", 5), authMiddleware,addSubcategory);
router.get("/subcategories",authMiddleware,getAllSubcategories);
router.put("/subcategory/:id", upload.array("images"),authMiddleware, updateSubcategory);
router.delete("/subcategories/:id",authMiddleware,deleteSubcategory);
// GET /api/subcategory/by-category/:categoryId
router.get('/by-category/:categoryId',authMiddleware,getSubcategoriesByCategory);




module.exports = router;
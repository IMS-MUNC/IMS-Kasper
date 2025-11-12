// 📁 routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/Multer/multer");
const { addSubcategory,getAllSubcategories,deleteSubcategory ,updateSubcategory,getSubcategoriesByCategory } = require("../controllers/subCategoryController");
const  {authMiddleware}=require("../middleware/auth.js");
const { verifyToken } = require("../middleware/Authentication/verifyToken");
const { checkPermission } = require("../middleware/permission/checkPermission");

router.post("/categories/:categoryId/subcategories", verifyToken, checkPermission("Subcategory", "write"), upload.array("images", 5), authMiddleware,addSubcategory);
router.get("/subcategories", verifyToken, checkPermission("Subcategory", "read"),authMiddleware,getAllSubcategories);
router.put("/subcategory/:id", verifyToken, checkPermission("Subcategory", "update"), upload.array("images"),authMiddleware, updateSubcategory);
router.delete("/subcategories/:id", verifyToken, checkPermission("Subcategory", "delete"),authMiddleware,deleteSubcategory);
// GET /api/subcategory/by-category/:categoryId
router.get('/by-category/:categoryId',authMiddleware,getSubcategoriesByCategory);




module.exports = router;
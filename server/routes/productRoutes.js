const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  getProductBarcodeDetails,
  updateProduct,
  deleteProductImage,
  deleteProduct,
  searchProductsByName,
  importProducts,
  getProductStock,
  getUpcomingExpiryProducts,
  getPurchaseReturnStock,
  getProductByBarcode,
  generateBarcode,
} = require("../controllers/productController");


const upload = require("../middleware/Multer/multer"); // ✅ fix double slash
const { authMiddleware } = require("../middleware/auth.js")

const path = require("path");

// Product stock API
router.get("/stock", authMiddleware, getProductStock);
router.get("/upcoming-expiry", authMiddleware, getUpcomingExpiryProducts);
// Lookup by barcode
router.get('/barcode/:code', authMiddleware, getProductByBarcode);
// Generate a unique barcode and optionally attach to a product
router.post('/generate-barcode', authMiddleware, generateBarcode);
// Preview route to return barcode-centric product details
router.get('/preview/:id', authMiddleware, getProductBarcodeDetails);
// Purchase return stock API (must be above /:id)
router.post("/create", upload.array("images", 10), authMiddleware, createProduct);
// ✅ New route: import products from CSV/Excel
router.post("/import", upload.single("file"), authMiddleware, importProducts);
// ✅ Existing routes
router.get("/search", authMiddleware, searchProductsByName); // ✅ must come before /products/:id
router.get("/", authMiddleware, getAllProducts);         // Read All
router.get("/:id", authMiddleware, getProductById);      // Read Single
router.put("/:id", upload.array("images", 10), authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProductImage)// Update
router.delete("/pro/:id", authMiddleware, deleteProduct);    // Delete





module.exports = router;

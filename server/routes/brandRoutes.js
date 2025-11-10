const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brandController");
const upload = require("../middleware/Multer/multer");

const { verifyToken } = require("../middleware/Authentication/verifyToken");
const { checkPermission } = require("../middleware/permission/checkPermission");
const { authMiddleware } = require("../middleware/auth.js")

// ✅ Create brand (requires 'Brand' → 'create')
router.post(
  "/addBrands",
  verifyToken,
  checkPermission("Brand", "write"),
  upload.array("image", 5),
  brandController.addBrand
);

// ✅ Update brand (requires 'Brand' → 'update')
router.put(
  "/editBrands/:id",
  verifyToken,
  checkPermission("Brand", "update"),
  upload.array("image", 5),
  brandController.updateBrand
);

// ✅ View all brands (requires 'Brand' → 'read')
router.get(
  "/getBrands",
   verifyToken,
  checkPermission("Brand", "read"),
  brandController.getBrands
);

// ✅ View only active brands (requires 'Brand' → 'read')
router.get(
  "/active-brands",

  brandController.getActiveBrands
);

// ✅ Delete brand (requires 'Brand' → 'delete')
router.delete(
  "/deleteBrand/:id",
   verifyToken,
  checkPermission("Brand", "delete"),
  brandController.deleteBrand
);

module.exports = router;

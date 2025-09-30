const express = require('express');
const router = express.Router();
const { getProductPurchaseDetails } = require('../controllers/productPurchaseDetailsController');
const { authMiddleware } = require('../middleware/auth');

// GET /api/products/:productId/purchasedetails
router.get('/:productId/purchasedetails', authMiddleware, getProductPurchaseDetails);

module.exports = router;

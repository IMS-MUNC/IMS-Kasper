const express = require('express');
const router = express.Router();
const {
  createPosSale,
  getPosSales,
  getPosSaleById,
  getSalesSummary
} = require('../controllers/posSaleController');
const { verifyToken } = require('../middleware/Authentication/verifyToken');
const { authMiddleware } = require("../middleware/auth.js")

// Apply authentication middleware to all routes
router.use(verifyToken);

// Create new POS sale
router.post('/create', authMiddleware, createPosSale);

// Get all POS sales with pagination
router.get('/transactions', authMiddleware, getPosSales);

// Get single POS sale by ID
router.get('/:id', authMiddleware, getPosSaleById);

// Get sales summary/statistics
router.get('/summary/daily', authMiddleware, getSalesSummary);

module.exports = router; 
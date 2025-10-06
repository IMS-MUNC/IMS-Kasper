const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// GET /api/stock/summary
router.get('/summary', stockController.getStockSummary);

module.exports = router;

const express = require('express');
const router = express.Router();
const stockHistoryController = require('../controllers/stockHistoryController');
const  {authMiddleware}=require("../middleware/auth.js")

router.get('/', authMiddleware,stockHistoryController.getStockHistory);

// Update a stock log
router.put('/:id', authMiddleware,stockHistoryController.updateStockHistory);

// Delete a stock log
router.delete('/:id',authMiddleware, stockHistoryController.deleteStockHistory);

module.exports = router;

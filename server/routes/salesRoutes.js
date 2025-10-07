// Get all invoices or by invoiceId
const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { authMiddleware } = require("../middleware/auth.js")

router.post('/create', authMiddleware, salesController.createSale);
router.get('/next-reference', authMiddleware, salesController.getNextReferenceNumber);

router.get('/', authMiddleware, salesController.getSales);
// Dashboard sales/return stats
router.get('/dashboard/stats', authMiddleware, salesController.getSalesReturnStats);
router.get('/allinvoice', authMiddleware, salesController.getAllInvoice);

// Stock History and Payment History routes (must be above :id)
router.get('/stockhistory', authMiddleware, salesController.getStockHistory);
router.get('/paymenthistory', authMiddleware, salesController.getPaymentHistory);

router.get('/:id', authMiddleware, salesController.getSaleById);
router.put('/:id', authMiddleware, salesController.updateSale);
router.delete('/:id', authMiddleware, salesController.deleteSale);



module.exports = router;

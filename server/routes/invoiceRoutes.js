const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const  {authMiddleware}=require("../middleware/auth.js")
const invoiceWhatsappController = require('../controllers/invoiceWhatsappController.js');

// Create invoice
router.post('/', authMiddleware,invoiceController.createInvoice);
// Get all invoices (search, pagination, filter)
router.get('/allinvoice', authMiddleware,invoiceController.getAllInvoice);
router.get('/',authMiddleware, invoiceController.getAllInvoices);
// Get invoice by ID
router.get('/:id',authMiddleware, invoiceController.getInvoiceById);
// Update invoice
router.put('/:id',authMiddleware, invoiceController.updateInvoice);
// Delete invoice
router.delete('/:id',authMiddleware, invoiceController.deleteInvoice);


// Print invoice
router.get('/print/:invoiceId',authMiddleware, invoiceController.printSalesInvoice);
// Download PDF
router.get('/pdf/:invoiceId', authMiddleware,invoiceController.downloadSalesInvoicePDF);
router.post("/bulk-delete", authMiddleware, invoiceController.bulkDeleteInvoice);

// Share invoice via email
router.post('/email/:id', authMiddleware,invoiceWhatsappController.shareInvoiceEmail);

// WhatsApp share
router.post('/whatsapp/:id', authMiddleware, invoiceWhatsappController.shareInvoiceWhatsapp);

router.post('/sms/:id', authMiddleware, invoiceWhatsappController.shareInvoiceSMS);

// Public PDF (no auth) — only for sandbox/testing
router.get('/public/pdf/:id', invoiceWhatsappController.publicInvoicePdf);


module.exports = router;

const express = require('express');
const router = express.Router();
const controller = require('../controllers/invoiceSettingsController');
const  {authMiddleware}=require("../middleware/auth.js")

router.post('/', authMiddleware,controller.createInvoiceSettings);
router.get('/',authMiddleware, controller.getInvoiceSettings);
router.put('/:id', authMiddleware,controller.updateInvoiceSettings);

module.exports = router;

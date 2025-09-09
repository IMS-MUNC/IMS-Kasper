const express = require('express');
const router = express.Router();
const creditNoteController = require('../controllers/creditNoteController');
const { authMiddleware } = require("../middleware/auth.js")

router.post('/return', authMiddleware, creditNoteController.createCreditNote);
router.get('/all', authMiddleware, creditNoteController.getAllCreditNotes);
router.get('/sale/:saleId', authMiddleware, creditNoteController.getAllCreditNotesBySale);
// Add more routes as needed (get, list, etc.)
// router.get('/all', authMiddleware, creditNoteController, getAllCreditNotes);
// router.get('/sale/:saleId',authMiddleware ,creditNoteController,getAllCreditNotesBySale);

module.exports = router;

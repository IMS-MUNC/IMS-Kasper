const express = require('express');
const router = express.Router();
const controller = require('../controllers/debitNoteController');
const { authMiddleware } = require("../middleware/auth.js")

router.get('/next-id', authMiddleware, controller.getNextDebitNoteId);
router.post('/', authMiddleware, controller.createDebitNote);
router.post('/return', authMiddleware, controller.createProductReturn);
// router.get('/', controller.getAllDebitNotes);
router.get('/getDebit', authMiddleware, controller.getAllDebit);
router.get('/summary', authMiddleware, controller.getDebitNoteSummary);

router.get('/:id', authMiddleware, controller.getDebitNoteById);
router.put('/:id', authMiddleware, controller.updateDebitNote);
router.delete('/:id', authMiddleware, controller.deleteDebitNote);

module.exports = router;

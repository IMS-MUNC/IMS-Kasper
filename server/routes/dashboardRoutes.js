const express = require('express');
const router = express.Router();
const { getInventorySummary } = require('../controllers/dashboardController');

router.get('/inventory-summary', getInventorySummary);

module.exports = router;

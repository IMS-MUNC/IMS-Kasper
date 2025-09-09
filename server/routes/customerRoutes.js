const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const  {authMiddleware}=require("../middleware/auth")


// Get all active customers
router.get('/active', customerController.getActiveCustomers);

router.post('/', authMiddleware,customerController.createCustomer);
router.get('/',authMiddleware, customerController.getAllCustomers);
router.get('/:id',authMiddleware, customerController.getCustomerById);
router.put('/:id', authMiddleware,customerController.updateCustomer);
router.delete('/:id',authMiddleware, customerController.deleteCustomer);

module.exports = router;

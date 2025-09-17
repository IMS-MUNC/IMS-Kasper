const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const  {authMiddleware}=require("../middleware/auth.js");
const upload = require("../middleware/Multer/multer");



// Get all active customers
router.get('/active', customerController.getActiveCustomers);

// router.post('/', authMiddleware,  upload.array('image'),customerController.createCustomer);
router.post('/', authMiddleware, upload.array('images', 5), customerController.createCustomer);
router.get('/',authMiddleware, customerController.getAllCustomers);
router.get('/:id',authMiddleware, customerController.getCustomerById);
router.put('/:id', authMiddleware,customerController.updateCustomer);
router.delete('/:id',authMiddleware, customerController.deleteCustomer);

module.exports = router;

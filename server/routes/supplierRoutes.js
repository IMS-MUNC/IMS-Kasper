const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

const upload = require("../middleware/Multer/multer");
const  {authMiddleware}=require("../middleware/auth.js")


// Create supplier
router.post('/', upload.array('images'), authMiddleware,supplierController.createSupplier);

// GSTIN verify and fetch real data
router.post('/verify-gstin', authMiddleware,supplierController.verifyGSTIN);

// Fetch all suppliers
router.get('/', authMiddleware,supplierController.getAllSuppliers);
router.get('/active', authMiddleware,supplierController.getActiveSuppliers);// router.get("/suppliers/active-dropdown", supplierController.getActiveSuppliersDropdown);


// Get single supplier
router.get('/:id',authMiddleware, supplierController.getSupplierById);

// Edit supplier
router.put('/:id', upload.array('images'),authMiddleware, supplierController.updateSupplier);

// Delete supplier
router.delete('/:id',authMiddleware, supplierController.deleteSupplier);



module.exports = router;




// const express = require('express');
// const router = express.Router();
// const supplierController = require('../controllers/supplierController');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

// // Create supplier
// router.post('/', upload.single('image'), supplierController.createSupplier);

// // GSTIN verify and fetch real data
// router.post('/verify-gstin', supplierController.verifyGSTIN);

// // Fetch all suppliers
// router.get('/', supplierController.getAllSuppliers);

// // Get single supplier
// router.get('/:id', supplierController.getSupplierById);

// // Edit supplier
// router.put('/:id', upload.single('image'), supplierController.updateSupplier);

// // Delete supplier
// router.delete('/:id', supplierController.deleteSupplier);

// module.exports = router;

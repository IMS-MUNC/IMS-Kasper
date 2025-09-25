const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");
const upload = require("../middleware/Multer/multer"); // Fixed double slash
const { authMiddleware } = require("../middleware/auth.js")

// 🔹 Purchase Routes
router.post("/create", upload.array('images'), authMiddleware, purchaseController.createPurchase);
router.get("/reference/next", authMiddleware, purchaseController.getNextReferenceNumber);
router.get("/", authMiddleware, purchaseController.getAllPurchases);
router.put("/:id", upload.array('images'), authMiddleware, purchaseController.updatePurchase);
router.put("/:id/return", authMiddleware, purchaseController.updatePurchaseOnReturn); // 🔥 This is new
router.delete("/:id", authMiddleware, purchaseController.deletePurchase);

// Purchase Report
router.get("/report", authMiddleware, purchaseController.getPurchaseReport);

// 🔹 Purchase Return Routes
// router.post("/return", purchaseController.createProductReturn); // create a new return
// router.get('/debit-notes',purchaseController.getAllDebitNotes);
router.put("/:id/return", authMiddleware, purchaseController.updatePurchase); // update purchase for return (PUT for update)
router.get("/return/all", authMiddleware, purchaseController.getAllReturns);     // list of all returns
// Restore soft-deleted purchase
router.put('/:id/restore', authMiddleware, purchaseController.restorePurchase);

// Permanently delete purchase
router.delete('/:id/permanent', authMiddleware, purchaseController.permanentDeletePurchase);
module.exports = router;



// const express = require("express");
// const router = express.Router();
// const purchaseController = require("../controllers/purchaseController");
// const upload = require("../middleware//Multer/multer");


// router.post("/create", upload.array('images'), purchaseController.createPurchase);
// router.get("/reference/next", purchaseController.getNextReferenceNumber);


// router.get("/", purchaseController.getAllPurchases);

// router.put('/:id', upload.array('images'), purchaseController.updatePurchase); // ✅ handles multipart/form-data

// router.delete("/:id", purchaseController.deletePurchase);

// module.exports = router;


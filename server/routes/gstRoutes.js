// routes/gstRoutes.js
const express = require('express');
const router = express.Router();
const gstController = require('../controllers/gstController');

// GET /api/gst/:gstin  (optional query param: ?email=...)
router.get('/:gstin', gstController.searchByGstin);

module.exports = router;



// const express = require("express");
// const router = express.Router();
// const {
//     addGst,
//     getAllGst,
//     updateGst,
//     deleteGst,
//     bulkImportGst,
//     verifyGstin,
//     trackReturns,
//     countApi,
// } = require("../controllers/gstController.js");
// const { authMiddleware } = require("../middleware/auth.js");

// // POST - Create GST
// router.post("/", authMiddleware, addGst);

// // GET - Read All GST
// router.get("/", getAllGst);

// // PUT - Update GST
// router.put("/:id", authMiddleware, updateGst);

// // DELETE - Delete GST
// router.delete("/:id", authMiddleware, deleteGst);

// // POST - Bulk Import GST
// router.post("/import", authMiddleware, bulkImportGst);

// // GET - Verify GSTIN via external API (server-side to avoid CORS)
// router.get("/verify", authMiddleware, verifyGstin);

// // POST - Accept gstin in body { gstin: '...' } to verify (useful for Postman / frontend POST)
// // Protect this route with app auth so callers must provide an application JWT.
// router.post('/search', authMiddleware, verifyGstin);

// // GET - Track Returns (forward to MastersIndia)
// router.get("/trackReturns", authMiddleware, trackReturns);

// // GET - Count API
// router.get("/count", authMiddleware, countApi);

// module.exports = router;

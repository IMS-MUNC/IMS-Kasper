const express = require("express");
const router = express.Router();
const {
  addCountry,
  getAllCountries,
  updateCountry,
  deleteCountry,
  bulkImportCountries,
  bulkDeleteCountry
} = require("../controllers/countryController");
const  {authMiddleware}=require("../middleware/auth.js")

// POST - Create
router.post("/",authMiddleware, addCountry);

// GET - Read All
router.get("/", authMiddleware,getAllCountries);

// PUT - Update
router.put("/:id",authMiddleware, updateCountry);

// DELETE - Delete
router.delete("/:id",authMiddleware, deleteCountry);

router.post('/import',authMiddleware, bulkImportCountries);

router.post("/bulk-delete", authMiddleware, bulkDeleteCountry);
module.exports = router;

const express = require("express");
const router = express.Router();
const cityController = require("../controllers/cityController");
const  {authMiddleware}=require("../middleware/auth.js")

// Add
router.post("/cities",authMiddleware, cityController.addCity);

// Get All
router.get("/cities",authMiddleware, cityController.getAllCities);

// Get By State
router.get("/cities/state/:stateId",authMiddleware, cityController.getCitiesByState);

// Update
router.put("/cities/:id",authMiddleware, cityController.updateCity);

// Delete
router.delete("/cities/:id", authMiddleware, cityController.deleteCity);
router.post("/bulk-delete", authMiddleware, cityController.bulkDeleteCity);

module.exports = router;

const express = require("express");
const { getWarranty, createWarranty, updateWarranty, deleteWarranty } = require("../controllers/warrantyControllers");
const  {authMiddleware}=require("../middleware/auth.js")


const router = express.Router();

router.get("/",authMiddleware,getWarranty);
router.post("/",authMiddleware,createWarranty);
router.put("/:id",authMiddleware,updateWarranty);
router.delete("/:id",authMiddleware,deleteWarranty);

module.exports = router;
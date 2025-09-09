const express = require("express");
const {  getVariant, createVariant, updateVariant, deleteVariant } = require("../controllers/varientController");
const  {authMiddleware}=require("../middleware/auth.js")


const router = express.Router();

router.get("/",authMiddleware,getVariant);
router.post("/",authMiddleware,createVariant);
router.put("/:id",authMiddleware,updateVariant);
router.delete("/:id",authMiddleware,deleteVariant);

module.exports = router;
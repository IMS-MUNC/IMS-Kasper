const express = require("express");
const { getGiftCard, createGiftCard, updateGiftCard, deletedGiftCard } = require("../controllers/GiftCardControllers");
const  {authMiddleware}=require("../middleware/auth.js")

const router = express.Router();

router.get("/",authMiddleware,getGiftCard);
router.post("/",authMiddleware,createGiftCard);
router.put("/:id",authMiddleware,updateGiftCard);
router.delete("/:id",authMiddleware,deletedGiftCard);

module.exports = router;
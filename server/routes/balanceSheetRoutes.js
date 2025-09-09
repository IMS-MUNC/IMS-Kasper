
const express = require("express");
const { saveBalanceSheet, getBalanceSheets } = require("../controllers/balanceSheetController");
const  {authMiddleware}=require("../middleware/auth.js")

const router = express.Router();

router.post("/", authMiddleware,saveBalanceSheet);
router.get("/", authMiddleware,getBalanceSheets);

module.exports = router;

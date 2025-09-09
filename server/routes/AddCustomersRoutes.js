const express = require("express");
const { createcustomers, getCustomers } = require("../controllers/AddCustomersControllers");
const  {authMiddleware}=require("../../middleware/auth.js")

const router = express.Router();

router.get("/",authMiddleware,getCustomers);
router.post("/",authMiddleware,createcustomers);


module.exports =  router;
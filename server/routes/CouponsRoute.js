// routes/couponRoutes.js
const express = require("express");
const router = express.Router();

const { 
  createCoupon, 
  getCoupons, 
  updateCoupon, 
  deleteCoupon 
} = require('../controllers/CouponsController');
const  {authMiddleware}=require("../middleware/auth.js")

router.post('/',authMiddleware, createCoupon);
router.get('/', authMiddleware,getCoupons);
router.put('/:id',authMiddleware, updateCoupon);
router.delete('/:id',authMiddleware, deleteCoupon);

module.exports = router;

const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  name: { type: String, },
  code: { type: String,unique: true },
  type: { type: String, enum: ['percentage', 'flat'],},
  discount: { type: String, required: true },
  limit: { type: Number, default: 0 },
  valid:{type: Date, default: Date.now},
  validStatus:{type: String},
  oncePerCustomer: { type: Boolean, default: false },
  description: { type: String },
  status: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  name: String,
  address1: String,
  address2: String,
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
  state: { type: mongoose.Schema.Types.ObjectId, ref: 'State' },
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
  postalCode: String,
  pincode: String,
});

const bankSchema = new mongoose.Schema({
  bankName: String,
  branch: String,
  accountHolder: String,
  accountNumber: String,
  ifsc: String,
});

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  currency: String,
  website: String,
  notes: String,
  billing: addressSchema,
  shipping: addressSchema,
  bank: bankSchema,
  
  status: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);

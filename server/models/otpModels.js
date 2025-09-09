// models/Otp.js
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 1800 } // Expires in 30 mins
});

module.exports = mongoose.model('Otp', otpSchema);

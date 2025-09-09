const mongoose = require('mongoose');

const CreditNoteSchema = new mongoose.Schema({
  creditNoteId: { type: String, required: true, unique: true },
  referenceNumber: { type: String },
  creditNoteDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  status: { type: String, default: 'Pending' },
  currency: { type: String, default: 'INR' },
  enableTax: { type: Boolean, default: false },
  billFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  billTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  items: [
    {
      productService: { type: String },
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      hsnCode: { type: String },
      quantity: { type: Number },
      unit: { type: String },
      rate: { type: Number },
      discount: { type: Number },
      tax: { type: Number },
      amount: { type: Number },
    }
  ],
  extraInfo: {
    notes: { type: String },
    terms: { type: String },
    bank: { type: String },
  },
  amount: { type: Number },
  cgst: { type: Number },
  sgst: { type: Number },
  discount: { type: Number },
  roundOff: { type: Boolean, default: false },
  total: { type: Number },
  totalInWords: { type: String },
  signature: { type: String },
  signatureName: { type: String },
  signatureImage: { type: String },
  sale: { type: mongoose.Schema.Types.ObjectId, ref: 'Sales' },
  reason: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('CreditNote', CreditNoteSchema);

const mongoose = require('mongoose');

const DebitNoteSchema = new mongoose.Schema({
  debitNoteId: { type: String, required: true, unique: true },
  referenceNumber: { type: String },
  debitNoteDate: { type: Date },
  dueDate: { type: Date },
  status: { type: String, enum: ['Paid', 'Pending', 'Cancelled'], default: 'Pending' },
  currency: { type: String, default: 'USD' },
  enableTax: { type: Boolean, default: false },
  billFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  billTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      unit: String,
        returnQty: Number, // ✅ Add this line
      purchasePrice: Number,
      discount: Number,
      tax: Number,
      taxAmount: { type: Number, default: 0 },
      unitCost: Number,
      totalCost: Number,
    },
  ],
  extraInfo: {
    notes: String,
    terms: String,
    bank: String
  },
  amount: Number,
  cgst: Number,
  sgst: Number,
  discount: String,
  roundOff: Boolean,
  total: Number,
  totalInWords: String,
  signature: String,
  signatureName: String,
  signatureImage: String,
  // returnQty: String, // Removed duplicate, only products array should have returnQty
  purchase: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' },
}, { timestamps: true });

module.exports = mongoose.model('DebitNote', DebitNoteSchema);

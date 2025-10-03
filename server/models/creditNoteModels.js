const mongoose = require("mongoose");

const CreditNoteSchema = new mongoose.Schema({
  // Soft delete flag
  isDeleted: { type: Boolean, default: false },
  creditNoteId: { type: String, required: true, unique: true },
  referenceNumber: { type: String },
  creditNoteDate: { type: Date, default: Date.now },
  dueDate: { type: Date },

  status: { type: String, default: "Pending" },
  currency: { type: String, default: "INR" },
  enableTax: { type: Boolean, default: false },

  billFrom: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  billTo: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },

  billing: { type: mongoose.Schema.Types.Mixed },
  shipping: { type: mongoose.Schema.Types.Mixed },

  // ✅ Changed "items" → "products"
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      saleQty: { type: Number, default: 0 },
      returnQty: { type: Number, default: 0 },
      quantity: { type: Number, default: 0 },

      unit: { type: String, default: "" },
      hsnCode: { type: String, default: "" },

      sellingPrice: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      discountType: { type: String, default: "" },
      discountAmount: { type: Number, default: 0 },

      tax: { type: Number, default: 0 },
      taxAmount: { type: Number, default: 0 },
      taxableAmount: { type: Number, default: 0 },

      subTotal: { type: Number, default: 0 },
      lineTotal: { type: Number, default: 0 },
      unitCost: { type: Number, default: 0 },
    },
  ],

  sale: { type: mongoose.Schema.Types.ObjectId, ref: "Sales" },
  saleDate: { type: Date },

  labourCost: { type: Number, default: 0 },
  orderDiscount: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },

  paymentType: { type: String },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
  paymentMethod: { type: String },
  transactionId: { type: String },
  onlineMod: { type: String },
  transactionDate: { type: Date },
  paymentStatus: { type: String },

  description: { type: String },
  notes: { type: String },
  reason: { type: String },

  images: { type: Array },

  cgst: { type: Number, default: 0 },
  sgst: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },

  roundOff: { type: Boolean, default: false },
  enableAddCharges: { type: Boolean, default: false },

  extraInfo: {
    notes: { type: String },
    terms: { type: String },
    bank: { type: String },
  },

  amount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },
  totalInWords: { type: String },

  signature: { type: String },
  signatureName: { type: String },
  signatureImage: { type: String },

  createdBy: {
    name: { type: String },
    email: { type: String },
  },
  updatedBy: {
    name: { type: String },
    email: { type: String },
  },
},
  { timestamps: true }
);

module.exports = mongoose.model("CreditNote", CreditNoteSchema);



// const mongoose = require('mongoose');


// const CreditNoteSchema = new mongoose.Schema({
//   creditNoteId: { type: String, required: true, unique: true },
//   referenceNumber: { type: String },
//   creditNoteDate: { type: Date, default: Date.now },
//   dueDate: { type: Date },
//   status: { type: String, default: 'Pending' },
//   currency: { type: String, default: 'INR' },
//   enableTax: { type: Boolean, default: false },
//   billFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
//   billTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
//   customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
//   billing: { type: mongoose.Schema.Types.Mixed },
//   shipping: { type: mongoose.Schema.Types.Mixed },
//   items: [
//     {

//       productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//       saleQty: { type: Number, default: "" },
//       quantity: { type: Number, default: "" },
//       sellingPrice: { type: Number, required: true },
//       discount: { type: Number, default: 0 },
//       tax: { type: Number, default: 0 },
//       unit: { type: String, default: "" }, // New field for unit
//       hsnCode: { type: String, default: "" }, // New field for HSN code
//       discountType: { type: String, default: "" },
//       unit: { type: String, default: "" },
//       hsnCode: { type: String, default: "" },
//       subTotal: { type: Number, default: "" },
//       discountAmount: { type: Number, default: "" },
//       taxableAmount: { type: Number, default: "" },
//       taxAmount: { type: Number, default: "" },
//       lineTotal: { type: Number, default: "" },
//       unitCost: { type: Number, default: "" },
//       returnQty: { type: Number, default: 0 },
//     }
//   ],
//   saleDate: { type: Date },
//   labourCost: { type: Number },
//   orderDiscount: { type: Number },
//   shippingCost: { type: Number },
//   paymentType: { type: String },
//   paidAmount: { type: Number },
//   dueAmount: { type: Number },
//   paymentMethod: { type: String },
//   transactionId: { type: String },
//   onlineMod: { type: String },
//   transactionDate: { type: Date },
//   paymentStatus: { type: String },
//   description: { type: String },
//   images: { type: Array },
//   notes: { type: String },
//   cgst: { type: Number },
//   sgst: { type: Number },
//   discount: { type: Number },
//   roundOff: { type: Boolean, default: false },
//   enableAddCharges: { type: Boolean, default: false },
//   extraInfo: {
//     notes: { type: String },
//     terms: { type: String },
//     bank: { type: String },
//   },
//   amount: { type: Number },
//   total: { type: Number },
//   grandTotal: { type: Number },
//   totalInWords: { type: String },
//   signature: { type: String },
//   signatureName: { type: String },
//   signatureImage: { type: String },
//   sale: { type: mongoose.Schema.Types.ObjectId, ref: 'Sales' },
//   reason: { type: String },
//   createdBy: {
//     name: { type: String },
//     email: { type: String }
//   },
//   updatedBy: {
//     name: { type: String },
//     email: { type: String }
//   },
// }, { timestamps: true });

// module.exports = mongoose.model('CreditNote', CreditNoteSchema);

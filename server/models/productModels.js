const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    sku: { type: String, unique: true },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
    hsn: {type: mongoose.Schema.Types.ObjectId,ref: "HSN", required: false,
    },


    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    itemBarcode: { type: String },
    store: { type: String },
    warehouse: {type: mongoose.Schema.Types.ObjectId, ref: "Warehouse", required: false,
    },
    // Pricing Section
    purchasePrice: { type: Number },
    sellingPrice: { type: Number },
    wholesalePrice: { type: Number },
    retailPrice: { type: Number },
    quantity: { type: Number },
    unit: { type: mongoose.Schema.Types.Mixed },
    taxType: { type: String },
    tax: { type: String },
    discountType: { type: String },
    discountValue: { type: Number },
    quantityAlert: { type: Number },

   
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    description: { type: String, maxlength: 300 },
    seoTitle: { type: String },
    seoDescription: { type: String },

    // Variants (like color, size, etc.)
    variants: {
      type: Map,
      of: [String], // Each key has array of values
      default: {},
    },

    // Other
    sellingType: { type: String },
    barcodeSymbology: { type: String },
    productType: { type: String, default: "Single" },
    itemType: { type: String },
    isAdvanced: { type: Boolean },
    trackType: { type: String },
    isReturnable: { type: Boolean },
    leadTime: { type: Number },
    reorderLevel: { type: String },
    initialStock: { type: String },
    serialNumber: { type: String },
    batchNumber: { type: String },
    returnable: { type: Boolean },
    expirationDate: { type: Date },

    newPurchasePrice: {
      type: [Number], // Array of numbers
      default: [],
    },
    newQuantity: {
      type: [Number], // Array of numbers
      default: [],
    },

    // newPurchasePrice: {
    //   type: Number,
    //   default: 0,
    // },
    // newQuantity: {
    //   type: Number,
    //   default: 0,
    // },


  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

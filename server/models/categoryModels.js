// models/Category.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
  },
  categorySlug: {
    type: String,
    required: true,
    unique: true,
  },
  categoryCode: {
    type: String,
    unique: true,
    sparse: true    // ✅ Allow documents to not have categoryCode initially

  },
  subcategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory"
  }]


}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);

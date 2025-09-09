

  // models/subCategory.js
  const mongoose = require("mongoose");
  
  const SubcategorySchema = new mongoose.Schema({
    subCategoryName: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,

    images: [String],

    status: {
        type: Boolean,
        default: true,
      },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
      }
  
  }, { timestamps: true });
  
  module.exports = mongoose.model("Subcategory", SubcategorySchema);
  
const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema(
  {
    unitsName: {
      type: String,
      required: true,
    },
    shortName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true, // ✅ This adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Unit", unitSchema);

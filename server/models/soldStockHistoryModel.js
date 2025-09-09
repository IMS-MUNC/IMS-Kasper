const mongoose = require("mongoose");

const salesHistorySchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        type: {
            type: String,
            enum: ["PURCHASE", "SALE", "RETURN", "ADJUSTMENT"],
            required: true,
        },
        soldQuantity: {
            type: Number,
            required: true,
        },
        referenceNumber: {
            type: String, // e.g. SL007
        },
        sellingPrice: {
            type: Number,
        },
        note: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("SalesHistory", salesHistorySchema);

const mongoose = require("mongoose");

const paymentHistorySchema = new mongoose.Schema({
    sale: { type: mongoose.Schema.Types.ObjectId, ref: "Sales" },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    paymentType: { type: String, enum: ["Full", "Partial", "Unpaid"], default: "Unpaid" },
    paymentStatus: { type: String, enum: ["Paid", "Partial", "Unpaid"], default: "Unpaid" },
    paidAmount: { type: Number, default: 0 },
    dueAmount: { type: Number, default: 0 },
    paymentMethod: { type: String }, // Cash / Bank / Online
    transactionId: { type: String },
    transactionDate: { type: Date, default: Date.now },
    notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("PaymentHistory", paymentHistorySchema);

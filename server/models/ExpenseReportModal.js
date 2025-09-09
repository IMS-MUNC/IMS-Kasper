const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    paymentStatus: { type: String, enum: ["Paid", "Pending", "Failed"], required: true },
    expenseTitle: { type: String, required: true },
    notes: { type: String },
    paymentMode: { type: String },
    paidTo: { type: String },
    amount: { type: Number, required: true },
     // ✅ Cloudinary receipt
    receipt: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;

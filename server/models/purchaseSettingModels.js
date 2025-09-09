// models/Settings.js
const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
    currencyCode: { type: String, default: "INR" },
    currencySymbol: { type: String, default: "₹" },
    conversionRate: { type: Number, default: 1 },
    percentageSymbol: { type: String, default: "%" },

    //   conversionRates: {
    //     type: Map,
    //     of: Number, // e.g., { USD: 1, INR: 83.2, EUR: 0.91 }
    //     default: {},
    //   },
});

module.exports = mongoose.model("Settings", settingsSchema);

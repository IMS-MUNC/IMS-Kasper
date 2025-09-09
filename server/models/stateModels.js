const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema({
  stateName: {
    type: String,
    required: true,
  },
  stateCode: {
    type: String,
    required: true,
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country", // Reference to Country model
    required: true,
  },
  cities:    [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "City", // Reference to Country model
    required: true,
  }],      // ← embeds cities
}, { timestamps: true });

module.exports = mongoose.model("State", stateSchema);

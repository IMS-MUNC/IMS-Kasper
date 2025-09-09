const mongoose = require("mongoose");

const AddCustomersSchema = new mongoose.Schema(
  {
    addcustomers: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AddCustomer", AddCustomersSchema);


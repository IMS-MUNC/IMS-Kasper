
const mongoose = require("mongoose");

const rackLevelSchema = new mongoose.Schema(
  {
    level: Number,
    barcode: String,
  },
  { _id: false }
);

const rackSchema = new mongoose.Schema(
  {
    rackLabel: String,
    shelfLevels: Number,
    capacity: Number,
    levels: [rackLevelSchema],
  },
  { _id: false }
);

const warehouseSchema = new mongoose.Schema(
  {
    warehouseName: {
      type: String,
      required: true
    },
    space: {
      type: String,
      //   required: true 
    },
    items: {
      type: String,
      // required: true
    },
    itemSize: {
      type: String,
      enum: ["small", "medium", "large"],
      default: "medium",
    },
    contactPerson: { type: String },
    warehouseCode: { type: String, required: true },
    warehouseOwner: { type: String, required: true },

    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      //  required: true
    },
    phoneWork: String,
    // streetAddress: String,
    address: { type: String, required: true },

    country: {
      // type: mongoose.Schema.Types.ObjectId,
      type: String,
      // ref: "Country",
      required: true,
    },
    state: {
      // type: mongoose.Schema.Types.ObjectId,
      type: String,
      // ref: "State",
      required: true,
    },
    city: {
      // type: mongoose.Schema.Types.ObjectId, 
      type: String,
      // ref: "City", 
      required: true
    },
    // postalCode: { 
    //     type: String, 
    //     // required: true
    //  },
    pinCode: {
      type: String,
      required: true
    },
    layout: {
      rows: { type: Number, required: true },
      columns: { type: Number, required: true },
      width: { type: String },
      zones: { type: String, required: true }
    },
    //   status: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    capacityEstimate: { type: Number }, // Optional but useful
    racks: [rackSchema],
    isFavorite: {
      type: Boolean,
      default: false,
    },
    //  Racks embedded here
  },
  { timestamps: true }
);

module.exports = mongoose.model("Warehouse", warehouseSchema);



// FINAL VERSION
// const mongoose = require("mongoose");

// const rackLevelSchema = new mongoose.Schema({
//     level: Number,
//     barcode: String,
// }, { _id: false });

// const rackSchema = new mongoose.Schema({
//     rackLabel: String,
//     shelfLevels: Number,
//     capacity: Number,
//     levels: [rackLevelSchema],
// }, { _id: false });

// const warehouseSchema = new mongoose.Schema({
//     warehouseName: { type: String, required: true },
//     space: { type: String, required: true },
//     items: { type: String, required: true },
//     itemSize: { type: String, enum: ["small", "medium", "large"], default: "medium" },
//     contactPerson: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
//     phone: { type: String, required: true },
//     email: { type: String, required: true },
//     phoneWork: String,
//     streetAddress: String,
//     country: { type: mongoose.Schema.Types.ObjectId, ref: "Country", required: true },
//     state: { type: mongoose.Schema.Types.ObjectId, ref: "State", required: true },
//     city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
//     postalCode: { type: String, required: true },
//     //   status: { type: Boolean, default: true },
//     status: {
//         type: String,
//         enum: ["Active", "Inactive"],
//         default: "Active",
//     },

//     capacityEstimate: { type: Number }, // Optional but useful
//     racks: [rackSchema], // ✅ Racks embedded here
// }, { timestamps: true });

// module.exports = mongoose.model("Warehouse", warehouseSchema);



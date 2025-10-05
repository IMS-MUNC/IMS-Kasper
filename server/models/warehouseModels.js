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

const blockItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Changed from itemId to productId
    quantity: { type: Number, default: 1, min: 0 }, // Default quantity to 1
    barcode: { type: String, required: false }, // Make barcode optional or generate it
  },
  { _id: false }
);

const cellSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., "1", "2", ..., "15"
    items: [blockItemSchema],
  },
  { _id: false }
);

const zoneSchema = new mongoose.Schema(
  {
    zone: { type: String, required: true }, // e.g., "Zone1", "Zone2"
    cells: [cellSchema],
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
    contactPerson: { type: String},
    warehouseCode :{type : String,  required:true},
    warehouseOwner: { type: String,  required:true },
    
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
    address: { type : String,  required:true},

    country: {
      // type: mongoose.Schema.Types.ObjectId,
        type :String,
      // ref: "Country",
      required: true,
    },
    state: {
      // type: mongoose.Schema.Types.ObjectId,
        type :String,
      // ref: "State",
      required: true,
    },
    city: { 
      // type: mongoose.Schema.Types.ObjectId, 
      type :String,
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
    rows: { type: Number },
    columns: { type: Number },
    width: { type: String },
    zones: { type: String }
  },
    //   status: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    capacityEstimate: { type: Number }, // Optional but useful
    blocks: [zoneSchema],
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

// const mongoose = require("mongoose");

// const warehouseSchema = new mongoose.Schema({
//   warehouseName: { type: String, required: true },
//   warehouseCode: { type: String, required: true, unique: true },
//   warehouseOwner: { type: String, required: true },
//   address: { type: String, required: true },

//   country: { type: String,ref: "Country",  required: true },
//   state: { type: String, ref: "State", required: true },
//   city: { type: String,ref: "City" },

//   pinCode: { type: String },
//   layout: {
//     rows: Number,
//     columns: Number,
//     width: Number,
//     zones: Number
//   }
// }, { timestamps: true });

// module.exports = mongoose.model("Warehouse", warehouseSchema);


// const mongoose = require("mongoose");

// const warehouseSchema = new mongoose.Schema({
//   warehouseName: { type: String, required: true },
//   space: { type: String, required: true },
//   items: { type: String, required: true },
//   contactPerson: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   phone: { type: String, required: true },
//   email: { type: String, required: true },
//   phoneWork: String,
//   streetAddress: String,
//   country: { type: mongoose.Schema.Types.ObjectId, ref: "Country", required: true },
//   state: { type: mongoose.Schema.Types.ObjectId, ref: "State", required: true },
//   city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
//   postalCode: { type: String, required: true },
//   status: { type: Boolean, default: true },
// }, { timestamps: true });

// module.exports = mongoose.model("Warehouse", warehouseSchema);

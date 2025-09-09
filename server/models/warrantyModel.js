const mongoose = require("mongoose");

const WarrantySchema = new mongoose.Schema({
    warranty: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    // duration: {
    //     type: String,
    //     required: true,
    // },
    status: {
        type: Boolean,
        default: false
    },
    toDate: {
        type: Date,
        required: true,
    },
    fromDate: {
        type: Date,
        required: true,
    }

},
    {
        timestamps: true
    });

module.exports = mongoose.model("Warranty", WarrantySchema);
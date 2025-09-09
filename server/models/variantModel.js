const mongoose = require("mongoose");

const VarientSchema = new mongoose.Schema({
    variant: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },

    status: {
        type: Boolean,
        default: false
    },

},
    {
        timestamps: true
    });

module.exports = mongoose.model("Varient", VarientSchema);
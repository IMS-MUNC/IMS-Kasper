
const mongoose = require("mongoose");

const gstSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    gstinCode: {
        type: String,
        required: true,
        unique: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("Gst", gstSchema);

const mongoose = require("mongoose")

const deviceSessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "userprofile", required: true },
    device: String,
    ipAddress: String,
    location: String,
    latitude: { type: Number },
    longitude: { type: Number },
    loginTime: { type: Date, default: Date.now }
    
}, {
    timestamps: true
});

const DeviceSession = mongoose.model("DeviceSession", deviceSessionSchema)
module.exports = DeviceSession;
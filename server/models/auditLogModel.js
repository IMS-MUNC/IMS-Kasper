const mongoose = require("mongoose");
const auditLogSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"Users", required:true},
    userName:{type: String},
    role:{type: String},
    module: {type: String}, // e.g. "Product", "Purchase", "Sales"
    action: {type: String}, // e.g. "CREATE", "UPDATE", "DELETE", "VIEW"
    description: {type: String}, // e.g. "Added product: Laptop X"
    oldData: { type: Object, default: null }, // optional: store before-change data
    newData:{ type: Object, default: null }, // optional: store after-change data
    ipAddress: { type: String },
    device: { type: String },
    createdAt: { type: Date, default: Date.now },

}, {
    timestamps:true
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
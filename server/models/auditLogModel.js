const mongoose = require("mongoose");
const auditLogSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"Users"},
    userName:String,
    role:String,
    module: String, // e.g. "Product", "Purchase", "Sales"
    action: String, // e.g. "CREATE", "UPDATE", "DELETE", "VIEW"
    description: String, // e.g. "Added product: Laptop X"
    oldData: Object, // optional: store before-change data
    newData: Object, // optional: store after-change data
    ipAddress: String,
    device: String,
    createdAt: { type: Date, default: Date.now },

}, {
    timestamps:true
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
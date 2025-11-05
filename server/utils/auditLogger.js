const AuditLog = require("../models/auditLogModel");
exports.createAuditLog = async ({
    user,
    module,
    action,
    description,
    oldData = null,
    newData = null,
    req = {},
}) => {
    try {
        await AuditLog.create({
            userId:user._id,
            userName:user.name,
            role:user.roleName,
            module,
            action,
            description,
            oldData,
            newData,
            ipAddress: req.ip || "unknown",
            device:req.headers["user-agent"],
        })
    }catch(error) {
        console.error("Audit log error:", error.message);
    }
}


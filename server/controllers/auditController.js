const AuditLog = require("../models/auditLogModel");


exports.getAuditLogs = async (req, res) => {
  try {
    const { module, action, role, search } = req.query;
    const filter = {};

    if (module) filter.module = module;
    if (action) filter.action = action;
    if (role) filter.role = role;
    if (search) filter.description = { $regex: search, $options: "i" };

    const logs = await AuditLog.find(filter)
    .populate({
        path:"userId",
        select:"firstName lastName role",
        populate: {
            path:"role",
            select:"roleName"
        }
    })
      .sort({ createdAt: -1 })  // ✅ correct method
      .limit(100);

    res.json(logs);
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ message: error.message });
  }
};

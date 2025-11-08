const AuditLog = require("../models/auditLogModel");
const Customer = require("../models/customerModel");
const Product = require("../models/productModels");
const Supplier = require("../models/supplierModel");


exports.getAuditLogs = async (req, res) => {
  try {
    const { module, action, role, search } = req.query;
    const filter = {};

    if (module) filter.module = module;
    if (action) filter.action = action;
    if (role) filter.role = role;
    if (search) filter.description = { $regex: search, $options: "i" };

    let logs = await AuditLog.find(filter)
    .populate({
        path:"userId",
        select:"firstName lastName role",
        populate: {
            path:"role",
            select:"roleName"
        }
    })
      .sort({ createdAt: -1 })  // ✅ correct method
      .limit(100)
      .lean();

      // Process each log to attach extra readable data
    for (const log of logs) {
      if (log.module === "Sales" && log.newData) {
        const { customer, products } = log.newData;

        // ✅ Get customer name from customer collection (inside billing.name)
        if (customer) {
          const customerDoc = await Customer.findById(customer).select("billing.name");
          log.customerName = customerDoc?.billing?.name || "Unknown Customer";
        } else {
          log.customerName = "-";
        }

        // ✅ Fetch product names + suppliers
        if (Array.isArray(products) && products.length > 0) {
          const productIds = products.map(p => p.productId);
          const productDocs = await Product.find({ _id: { $in: productIds } }).select("productName supplier");

          // For each product, attach supplier name
          log.productDetails = await Promise.all(
            productDocs.map(async (p) => {
              let supplierName = "-";
              if (p.supplier) {
                const supplierDoc = await Supplier.findById(p.supplier).select("name");
                supplierName = supplierDoc?.name || "-";
              }
              return {
                productName: p.productName,
                supplierName,
              };
            })
          );
        } else {
          log.productDetails = [];
        }
      }
    }
    res.json(logs);
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ message: error.message });
  }
};

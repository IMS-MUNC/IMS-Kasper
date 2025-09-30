const Gst = require("../models/gstModels");

//  Create/Add GST
exports.addGst = async (req, res) => {
  try {
    const { name, code, gstinCode } = req.body;

    if (!name || !code || !gstinCode) {
      return res.status(400).json({ message: "Name, code, and GSTIN code are required" });
    }

    const existing = await Gst.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "GST already exists" });
    }

    const gst = new Gst({ name, code, gstinCode });
    await gst.save();
    res.status(201).json(gst);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Bulk Import GST
// POST /api/gst/import
exports.bulkImportGst = async (req, res) => {
  try {
    const { gsts } = req.body;
    if (!Array.isArray(gsts) || gsts.length === 0) {
      return res.status(400).json({ message: "No GST entries provided" });
    }

    const bulkOps = gsts.map((item) => ({
      updateOne: {
        filter: { name: item.name }, // Or match by code
        update: { $set: { name: item.name, code: item.code, gstinCode: item.gstinCode } },
        upsert: true,
      },
    }));

    await Gst.bulkWrite(bulkOps);

    res.status(200).json({ message: `${gsts.length} GST entries processed successfully.` });
  } catch (err) {
    res.status(500).json({ message: "Bulk import error", error: err.message });
  }
};

//  Get All GST
exports.getAllGst = async (req, res) => {
  try {
    const gsts = await Gst.find().sort({ createdAt: -1 });
    res.status(200).json(gsts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update GST
exports.updateGst = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, gstinCode } = req.body;

    const gst = await Gst.findById(id);
    if (!gst) {
      return res.status(404).json({ message: "GST not found" });
    }

    gst.name = name || gst.name;
    gst.code = code || gst.code;
    gst.gstinCode = gstinCode || gst.gstinCode;

    await gst.save();
    res.status(200).json(gst);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//  Delete GST
exports.deleteGst = async (req, res) => {
  try {
    const { id } = req.params;
    const gst = await Gst.findByIdAndDelete(id);

    if (!gst) {
      return res.status(404).json({ message: "GST not found" });
    }

    res.status(200).json({ message: "GST deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const Gst = require("../models/gstModels");
const axios = require("axios");

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

// Verify GSTIN via Masters India API
// GET /api/gst/verify?gstin=12GSPTN0792G1Z2
exports.verifyGstin = async (req, res) => {
  try {
    let { gstin } = req.query;
    if (!gstin) {
      return res.status(400).json({ error: true, message: "gstin is required" });
    }
    // Sanitize GSTIN: trim and uppercase as per common formats
    gstin = String(gstin).trim().toUpperCase();

    const MI_AUTH = process.env.MI_AUTH;
    const MI_CLIENT_ID = process.env.MI_CLIENT_ID;
    if (!MI_AUTH || !MI_CLIENT_ID) {
      return res.status(500).json({ error: true, message: "Masters India API not configured" });
    }

    // Ensure we don't double-prefix "Bearer " if the env already contains it
    const authHeaderValue = MI_AUTH.startsWith("Bearer ") ? MI_AUTH : `Bearer ${MI_AUTH}`;

    const miRes = await axios.get("https://commonapi.mastersindia.co/commonapis/searchgstin", {
      params: { gstin },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authHeaderValue,
        client_id: MI_CLIENT_ID,
      },
    });

    const payload = miRes.data;
    if (payload && payload.error === false && payload.data) {
      const info = JSON.parse(payload.data);
      return res.json({
        error: false,
        data: {
          gstin: info.gstin,
          name: info.lgnm,
          status: info.sts,
          type: info.dty,
          registrationDate: info.rgdt,
          stateJurisdiction: info.stj,
          centerJurisdiction: info.ctj,
        },
      });
    }
    return res.status(400).json({ error: true, message: payload?.message || "Verification failed" });
  } catch (err) {
    // Surface upstream error details to help diagnose (e.g., 401 due to invalid token)
    const status = err.response?.status || 500;
    const upstream = err.response?.data;
    console.error("GST verify error:", status, upstream || err.message);
    return res.status(status).json({
      error: true,
      message: upstream?.message || err.message || "Verification failed",
      details: upstream || undefined,
    });
  }
};

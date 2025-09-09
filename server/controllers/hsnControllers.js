
// controllers/hsnController.js
const xlsx = require('xlsx');
const HSN = require('../models/hsnModels');

exports.getPaginatedHSN = async (req, res) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const search = req.query.search ? req.query.search.trim() : '';
    try {
        let query = {};
        if (search) {
            // Case-insensitive search on hsnCode or description
            query = {
                $or: [
                    { hsnCode: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            };
        }
        const [items, total] = await Promise.all([
            HSN.find(query).skip((page - 1) * limit).limit(limit).sort({ hsnCode: 1 }),
            HSN.countDocuments(query)
        ]);
        res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// Get all HSN records 
exports.getAllHSN = async (req, res) => {
    try {
        const items = await HSN.find()
            .select("hsnCode description") // select only fields needed
            .sort({ hsnCode: 1 });

        res.json({ success: true, data: items });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createHSN = async (req, res) => {
    const { hsnCode, description } = req.body;
    try {
        const hsn = new HSN({ hsnCode, description });
        await hsn.save();
        res.status(201).json(hsn);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateHSN = async (req, res) => {
    const { hsnCode, description } = req.body;
    try {
        const updated = await HSN.findByIdAndUpdate(
            req.params.id,
            { hsnCode, description },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteHSN = async (req, res) => {
    try {
        await HSN.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.importHSN = async (req, res) => {
  try {
    const { hsnItems } = req.body;

    if (!Array.isArray(hsnItems) || hsnItems.length === 0) {
      return res.status(400).json({ message: "No HSN data provided" });
    }

    // 🔍 Debug logging
    console.log("Received hsnItems:", hsnItems);

    const bulkOps = hsnItems
      .filter(item => item.hsnCode && item.description) // Validate data
      .map((item) => ({
        updateOne: {
          filter: { hsnCode: item.hsnCode },
          update: { $set: { hsnCode: item.hsnCode, description: item.description } },
          upsert: true,
        },
      }));

    if (bulkOps.length === 0) {
      return res.status(400).json({ message: "No valid HSN entries found" });
    }

    await HSN.bulkWrite(bulkOps);

    res.status(200).json({ message: `${bulkOps.length} HSN records imported.` });
  } catch (err) {
    console.error("HSN import error:", err);
    res.status(500).json({ message: "Import failed", error: err.message });
  }
};


exports.bulkImport = async (req, res) => {
    try {
      const { hsnItems } = req.body;
      if (!Array.isArray(hsnItems) || hsnItems.length === 0) {
        return res.status(400).json({ message: "No HSN provided" });
      }
  
      const bulkOps = hsnItems.map((item) => ({
        updateOne: {
        //   filter: { name: item.name }, // Or match by code
        //   update: { $set: { name: item.name, code: item.code } },
         filter: { hsnCode: item.hsnCode },
          update: { $set: { hsnCode: item.hsnCode, description: item.description } },
          upsert: true, // 👈 create if not exists
        },
      }));
  
      await HSN.bulkWrite(bulkOps);
  
      res.status(200).json({ message: `${hsnItems.length} HSN processed successfully.` });
    } catch (err) {
      res.status(500).json({ message: "Bulk import error", error: err.message });
    }
  };


exports.exportHSN = async (req, res) => {
    try {
        const data = await HSN.find();
        const exportData = data.map(item => ({
            HSNCode: item.hsnCode,
            Description: item.description
        }));
        const ws = xlsx.utils.json_to_sheet(exportData);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'HSN');
        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
        res.setHeader('Content-Disposition', 'attachment; filename=hsn.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


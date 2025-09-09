
// controllers/unitController.js
const Unit = require("../models/unitsModels");

exports.createUnit = async (req, res) => {
  try {
    const { unitsName, shortName, status } = req.body;
    const newUnit = new Unit({ unitsName, shortName, status });
    await newUnit.save();
    res.status(201).json({ message: "Unit created successfully", unit: newUnit });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getUnits = async (req, res) => {
  try {
    const units = await Unit.find();
    res.status(200).json(units);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getActiveUnits = async (req, res) => {
  try {
    const activeUnits = await Unit.find({ status: "Active" })
      .select("unitsName shortName") // only these fields
      .sort({ createdAt: -1 }); // optional: latest first

    res.status(200).json({
      message: "Active units fetched successfully",
      total: activeUnits.length,
      units: activeUnits,
    });
  } catch (error) {
    console.error("Error fetching active units:", error);
    res.status(500).json({ message: "Server error", error });
  }
};




exports.getUnitById = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id);
    if (!unit) return res.status(404).json({ message: "Unit not found" });
    res.status(200).json(unit);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};




exports.updateUnit = async (req, res) => {
  try {
    const { unitsName, shortName, status } = req.body;
    const unit = await Unit.findByIdAndUpdate(
      req.params.id,
      { unitsName, shortName, status },
      { new: true }
    );
    if (!unit) return res.status(404).json({ message: "Unit not found" });
    res.status(200).json({ message: "Unit updated successfully", unit });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteUnit = async (req, res) => {
  try {
    const unit = await Unit.findByIdAndDelete(req.params.id);
    if (!unit) return res.status(404).json({ message: "Unit not found" });
    res.status(200).json({ message: "Unit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


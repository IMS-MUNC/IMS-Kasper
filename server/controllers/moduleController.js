const Module = require("../models/moduleModel");

exports.createModule = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Module name is required" });

    const existing = await Module.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
    if (existing) return res.status(400).json({ message: "Module already exists" });

    const newModule = new Module({ name });
    await newModule.save();
    res.status(201).json({ message: "Module created", module: newModule });
  } catch (err) {
    console.error("Create Module Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getModules = async (req, res) => {
  try {
    const modules = await Module.find().sort({ name: 1 });
    res.status(200).json(modules);
  } catch (err) {
    console.error("Get Modules Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

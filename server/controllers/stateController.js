const State = require("../models/stateModels");
const Country = require("../models/countryModels");

// ✅ Add State
exports.addState = async (req, res) => {
  try {
    const { stateName, stateCode, country } = req.body;

    if (!stateName || !stateCode || !country) {
      return res.status(400).json({ message: "Name, code, and country are required" });
    }

    const existing = await State.findOne({ stateName, country });
    if (existing) {
      return res.status(400).json({ message: "State already exists for this country" });
    }

    const state = new State({ stateName, stateCode, country });
    await state.save();

    const populated = await state.populate("country");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Bulk Import States
exports.bulkImportStates = async (req, res) => {
  try {
    const { states } = req.body;

    if (!Array.isArray(states) || states.length === 0) {
      return res.status(400).json({ message: "No states provided" });
    }

    const bulkOps = states.map((item) => ({
      updateOne: {
        filter: { stateName: item.stateName, country: item.country },
        update: { $set: { stateName: item.stateName, stateCode: item.stateCode, country: item.country } },
        upsert: true,
      },
    }));

    await State.bulkWrite(bulkOps);

    res.status(200).json({ message: `${states.length} states processed successfully.` });
  } catch (err) {
    res.status(500).json({ message: "Bulk import error", error: err.message });
  }
};

// ✅ Get All States (with populated country)
exports.getAllStates = async (req, res) => {
  try {
    const states = await State.find().populate("country").sort({ createdAt: -1 });
    res.status(200).json(states);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get states by country ID
exports.getStatesByCountry = async (req, res) => {
    try {
      const { countryId } = req.params;
      const states = await State.find({ country: countryId }).populate("country");
      res.status(200).json(states);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  

// ✅ Update State
// exports.updateState = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { stateName, stateCode, country } = req.body;

//     const state = await State.findById(id);
//     if (!state) {
//       return res.status(404).json({ message: "State not found" });
//     }

//     state.stateName = stateName || state.stateName;
//     state.stateCode = stateCode || state.stateCode;
//     state.country = country || state.country;

//     await state.save();
//     const populated = await state.populate("country");
//     res.status(200).json(populated);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
exports.updateState = async (req, res) => {
    try {
      const { id } = req.params;
      const { stateName, stateCode } = req.body;
  
      // Find state by ID
      const state = await State.findById(id);
      if (!state) {
        return res.status(404).json({ message: "State not found" });
      }
  
      // Update only if values are provided
      if (stateName) state.stateName = stateName;
      if (stateCode) state.stateCode = stateCode;
  
      // Save updated state
      await state.save();
  
      // Populate country if it exists
      const populated = await state.populate("country");
  
      res.status(200).json(populated);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  
// ✅ Delete State
exports.deleteState = async (req, res) => {
  try {
    const { id } = req.params;
    const state = await State.findByIdAndDelete(id);

    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }

    res.status(200).json({ message: "State deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.bulkDeleteState = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing 'ids', array in request body" });
    }
  const result =  await State.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({message: `${result.deletedCount} states deleted successfully`,
      deletedCount: result.deletedCount,})
  } catch (error) {
    res
      .status(500)
      .json({ message: "Bulk delete failed", error: error.message });
  }
};

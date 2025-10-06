const Country = require("../models/countryModels");

// ✅ Create/Add Country
exports.addCountry = async (req, res) => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: "Name and code are required" });
    }

    const existing = await Country.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Country already exists" });
    }

    const country = new Country({ name, code });
    await country.save();
    res.status(201).json(country);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/countries/import
exports.bulkImportCountries = async (req, res) => {
  try {
    const { countries } = req.body;
    if (!Array.isArray(countries) || countries.length === 0) {
      return res.status(400).json({ message: "No countries provided" });
    }

    const bulkOps = countries.map((item) => ({
      updateOne: {
        filter: { name: item.name }, // Or match by code
        update: { $set: { name: item.name, code: item.code } },
        upsert: true, // 👈 create if not exists
      },
    }));

    await Country.bulkWrite(bulkOps);

    res.status(200).json({
      message: `${countries.length} countries processed successfully.`,
    });
  } catch (err) {
    res.status(500).json({ message: "Bulk import error", error: err.message });
  }
};

// ✅ Get All Countries
exports.getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find().sort({ createdAt: -1 });
    res.status(200).json(countries);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Update Country
exports.updateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code } = req.body;

    const country = await Country.findById(id);
    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    country.name = name || country.name;
    country.code = code || country.code;

    await country.save();
    res.status(200).json(country);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Delete Country
exports.deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const country = await Country.findByIdAndDelete(id);

    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    res.status(200).json({ message: "Country deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.bulkDeleteCountry = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing 'ids', array in request body" });
    }
  const result =  await Country.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({message: `${result.deletedCount} countries deleted successfully`,
      deletedCount: result.deletedCount,})
  } catch (error) {
    res
      .status(500)
      .json({ message: "Bulk delete failed", error: error.message });
  }
};

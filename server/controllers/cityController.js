const City = require("../models/cityModels");
const State = require("../models/stateModels");
const Country = require("../models/countryModels");

// Add City
exports.addCity = async (req, res) => {
  try {
    const { cityName, cityCode, state, country } = req.body;

    if (!cityName || !cityCode || !state || !country) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await City.findOne({ cityName, State, Country });
    if (existing) {
      return res.status(400).json({ message: "City already exists in this state and country" });
    }

    const city = new City({ cityName, cityCode, state, country });
    await city.save();

    const populated = await city.populate(["state", "country"]);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all cities with populated state and country
exports.getAllCities = async (req, res) => {
  try {
    const cities = await City.find().populate(["state", "country"]).sort({ createdAt: -1 });
    res.status(200).json(cities);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get cities by state or country (optional)
exports.getCitiesByState = async (req, res) => {
  try {
    const { stateId } = req.params;
    const cities = await City.find({ state: stateId }).populate(["state", "country"]);
    res.status(200).json(cities);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update City
exports.updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const { cityName, cityCode } = req.body;

    const city = await City.findById(id);
    if (!city) return res.status(404).json({ message: "City not found" });

    if (cityName) city.cityName = cityName;
    if (cityCode) city.cityCode = cityCode;

    await city.save();
    const populated = await city.populate(["state", "country"]);
    res.status(200).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete City
exports.deleteCity = async (req, res) => {
  try {
    const { id } = req.params;
    const city = await City.findByIdAndDelete(id);
    if (!city) return res.status(404).json({ message: "City not found" });

    res.status(200).json({ message: "City deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.bulkDeleteCity = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing 'ids', array in request body" });
    }
  const result =  await City.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({message: `${result.deletedCount} cities deleted successfully`,
      deletedCount: result.deletedCount,})
  } catch (error) {
    res
      .status(500)
      .json({ message: "Bulk delete failed", error: error.message });
  }
};

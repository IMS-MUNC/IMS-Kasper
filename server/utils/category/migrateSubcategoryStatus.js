// scripts/migrateSubcategoryStatus.js

const mongoose = require("mongoose");
const Subcategory = require("../../models/subCateoryModal"); // Update path as per your project

const MONGO_URI = "mongodb+srv://amar:amar@atlascluster.eu1cogy.mongodb.net/Inventory"; // 🔁 Replace with your DB URI


async function migrateStatusField() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");

    const result = await Subcategory.updateMany(
      { status: { $exists: false } }, // ⚠️ Only update if status doesn't exist
      { $set: { status: true } } // ✅ Default to active
    );

    console.log(
      `Migration complete. ${result.modifiedCount} subcategories updated.`
    );
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    mongoose.disconnect();
  }
}

migrateStatusField();

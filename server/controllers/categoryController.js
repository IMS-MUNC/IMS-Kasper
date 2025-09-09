// controllers/categoryController.js
const Category = require("../models/categoryModels");

// CREATE
exports.createCategory = async (req, res) => {
    try {
      const { categoryName, categorySlug } = req.body;
      if (!categoryName || !categorySlug) {
        return res.status(400).json({ message: "All fields required." });
      }
  
      const exists = await Category.findOne({
        $or: [{ categoryName }, { categorySlug }]
      });
      if (exists) {
        return res.status(400).json({ message: "Category already exists." });
      }
  
      const categoryCode = await generateCategoryCode();
  
      const category = await Category.create({
        categoryName,
        categorySlug,
        categoryCode
      });
  
      res.status(201).json({ message: "Category created", category });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  const generateCategoryCode = async () => {
    const lastCategory = await Category.findOne().sort({ createdAt: -1 });
  
    if (!lastCategory || !lastCategory.categoryCode) {
      return "CAT-0001";
    }
  
    const lastCodeNum = parseInt(lastCategory.categoryCode.split("-")[1], 10);
    const newCodeNum = lastCodeNum + 1;
  
    return `CAT-${String(newCodeNum).padStart(4, "0")}`;
  };

  exports.bulkAssignCategoryCodes = async (req, res) => {
  try {
    const { selectedIds } = req.body;

    if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
      return res.status(400).json({ message: "No categories selected" });
    }

    const categories = await Category.find({ _id: { $in: selectedIds } }).sort({ createdAt: 1 });

    for (let i = 0; i < categories.length; i++) {
      const code = `CAT-${String(i + 1).padStart(4, '0')}`;
      categories[i].categoryCode = code;
      await categories[i].save();
    }

    res.status(200).json({ message: "Codes assigned successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};




exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// READ (ONE)
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found." });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// UPDATE
exports.updateCategory = async (req, res) => {
  try {
    const { categoryName, categorySlug } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { categoryName, categorySlug },
      { new: true }
    );
    if (!category) return res.status(404).json({ message: "Category not found." });

    res.status(200).json({ message: "Category updated", category });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found." });

    res.status(200).json({ message: "Category deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// bulk delete
// controllers/categoryController.js

// Bulk delete categories
exports.bulkDeleteCategories = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid or missing 'ids' array in request body." });
    }

    await Category.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: "Categories deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Bulk delete failed", error: error.message });
  }
};


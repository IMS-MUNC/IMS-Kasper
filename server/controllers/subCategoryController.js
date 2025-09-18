// 📁 controllers/categoryController.js
const Category = require("../models/categoryModels");
const Subcategory = require("../models/subCateoryModal");
const cloudinary = require("../utils/cloudinary/cloudinary");

exports.addSubcategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { subCategoryName, description, status } = req.body;

    // Validate required fields
    if (!subCategoryName || !description) {
      return res.status(400).json({ message: "Subcategory name and description are required" });
    }

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const category = await Category.findById(categoryId);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    // Upload images to Cloudinary (handle case where no files are uploaded)
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const imageUploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: "subcategory_images" })
      );

      const uploadedImages = await Promise.all(imageUploadPromises);
      imageUrls = uploadedImages.map((img) => img.secure_url);
    }

    const subcategory = new Subcategory({
      subCategoryName,
      description,
      status: status === "true" || status === true,
      images: imageUrls,
      category: categoryId,
    });

    const savedSubcategory = await subcategory.save();

    category.subcategories.push(savedSubcategory._id);
    await category.save();

    res.status(200).json({
      message: "Subcategory added successfully",
      subcategory: savedSubcategory,
    });
  } catch (error) {
    console.error("Add Subcategory Error:", error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({ message: "Subcategory name already exists" });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: "Validation error", errors: validationErrors });
    }
    
    // Handle Cloudinary errors
    if (error.message && error.message.includes('cloudinary')) {
      return res.status(500).json({ message: "Image upload failed", error: error.message });
    }
    
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Subcategories with Category Info (including categoryCode)
exports.getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find()
      .populate("category", "categoryName categoryCode") // populate both name and code
      .sort({ createdAt: -1 });

    res.status(200).json(subcategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.updateSubcategory = async (req, res) => {
    try {
      const { id } = req.params;
      const { subCategoryName, description, status, categoryId } = req.body;
  
      const subcategory = await Subcategory.findById(id);
      if (!subcategory)
        return res.status(404).json({ message: "Subcategory not found" });
  
      subcategory.subCategoryName = subCategoryName;
      subcategory.description = description;
      subcategory.status = status === "true" || status === true;
  
      if (subcategory.category.toString() !== categoryId) {
        const oldCategory = await Category.findById(subcategory.category);
        if (oldCategory) {
          oldCategory.subcategories.pull(subcategory._id);
          await oldCategory.save();
        }
  
        const newCategory = await Category.findById(categoryId);
        if (!newCategory)
          return res.status(404).json({ message: "New category not found" });
  
        newCategory.subcategories.push(subcategory._id);
        await newCategory.save();
  
        subcategory.category = categoryId;
      }
  
      // Handle new image uploads
      if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map((file) =>
          cloudinary.uploader.upload(file.path, {
            folder: "subcategory_images",
          })
        );
  
        const uploadedImages = await Promise.all(uploadPromises);
        const imageUrls = uploadedImages.map((img) => img.secure_url);
  
        subcategory.images = imageUrls;
      }
  
      const updatedSubcategory = await subcategory.save();
  
      res.status(200).json({
        message: "Subcategory updated successfully",
        subcategory: updatedSubcategory,
      });
    } catch (error) {
      console.error("Update Subcategory Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };




  // Delete a subcategory
exports.deleteSubcategory = async (req, res) => {
    try {
      const { id } = req.params;
  
      const subcategory = await Subcategory.findById(id);
      if (!subcategory) return res.status(404).json({ message: "Subcategory not found" });
  
      // Remove subcategory reference from its category
      const category = await Category.findById(subcategory.category);
      if (category) {
        category.subcategories.pull(subcategory._id);
        await category.save();
      }
  
      // Optionally: Remove images from Cloudinary (not implemented here)
  
      await subcategory.deleteOne();
  
      res.status(200).json({ message: "Subcategory deleted successfully" });
    } catch (error) {
      console.error("Delete Subcategory Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  exports.getSubcategoriesByCategory = async (req, res) => {
    const {categoryId} = req.params;
    try {
      const subcategories = await Subcategory.find({ category: categoryId });
      res.status(200).json(subcategories);
    } catch (error) {
      console.error("Failed to fetch subcategories", error);
      res.status(500).json({ message: "Failed to fetch subcategories" });
    }
  };
  
  
  
// 📁 controllers/categoryController.js
const Category = require("../models/categoryModels");
const Subcategory = require("../models/subCateoryModal");
const cloudinary = require("../utils/cloudinary/cloudinary");

exports.addSubcategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { subCategoryName, description, status } = req.body;

    const category = await Category.findById(categoryId);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    // Upload images to Cloudinary
    const imageUploadPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, { folder: "subcategory_images" })
    );

    const uploadedImages = await Promise.all(imageUploadPromises);
    const imageUrls = uploadedImages.map((img) => img.secure_url);

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
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Subcategories with Category Info (including categoryCode)
exports.getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find({ status: true })
  .populate("category", "categoryName categoryCode")
  .sort({ createdAt: -1 });
    // const subcategories = await Subcategory.find()
    //   .populate("category", "categoryName categoryCode") // populate both name and code
    //   .sort({ createdAt: -1 });

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
  
  
  
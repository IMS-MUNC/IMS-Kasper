const Brand = require("../models/brandModels");
const cloudinary = require("../utils/cloudinary/cloudinary");


exports.addBrand = async (req, res) => {
    try {
      const { brandName, status } = req.body;

      // 🔍 Check if brand already exists (case-insensitive)
    const existingBrand = await Brand.findOne({
        brandName: { $regex: new RegExp("^" + brandName + "$", "i") },
      });
  
      if (existingBrand) {
        return res.status(400).json({ message: "Brand already exists" });
      }


    const uploadedImages = await Promise.all(
        req.files.map((file) =>
          cloudinary.uploader.upload(file.path, { folder: "brand_images" })
        )
      );
      
      const imageUrls = uploadedImages.map((img) => ({
        url: img.secure_url,
        public_id: img.public_id,
      }));
      
  
      const brand = new Brand({
        brandName,
        image: imageUrls,
        status: status === "Active" ? "Active" : "Inactive",
      });
  
      await brand.save();
  
      res.status(201).json({
        message: "Brand created successfully",
        brand,
      });
    } catch (error) {
      console.error("Add Brand Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  exports.updateBrand = async (req, res) => {
    try {
      const { brandName, status } = req.body;
      const { id } = req.params;
  
      const brand = await Brand.findById(id);
      if (!brand) return res.status(404).json({ message: "Brand not found" });
  
      // Update basic fields
      brand.brandName = brandName || brand.brandName;
      brand.status = status === "Active" ? "Active" : "Inactive";
  
      // If new images are uploaded
      if (req.files && req.files.length > 0) {
        const imageUploadPromises = req.files.map((file) =>
          cloudinary.uploader.upload(file.path, { folder: "brand_images" })
        );
  
        const uploadedImages = await Promise.all(imageUploadPromises);
        // const imageUrls = uploadedImages.map((img) => img.secure_url);
  
        // brand.image = imageUrls;
        const imageUrls = uploadedImages.map((img) => ({
            url: img.secure_url,
            public_id: img.public_id,
          }));
          brand.image = imageUrls;
      }
  
      await brand.save();
  
      res.status(200).json({
        message: "Brand updated successfully",
        brand,
      });
    } catch (error) {
      console.error("Update Brand Error:", error);
      if (error.code === 11000) {
    return res.status(400).json({ message: "Brand name must be unique" });
  }
   res.status(500).json({ message: "Server error" });
    }
  };


// Get all brands (sorted by latest)
exports.getBrands = async (req, res) => {
    try {
      const brands = await Brand.find().sort({ createdAt: -1 });
  
    //   res.status(200).json({
    //     message: "Brands fetched successfully",
    //     total: brands.length,
    //     brands,
    //   });
      res.status(200).json({
        message: "Brands fetched successfully",
        brands, // <-- array of brand objects
      });
    } catch (error) {
      console.error("Get Brands Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  // Get only active brands (sorted by latest)
  exports.getActiveBrands = async (req, res) => {
    try {
      const activeBrands = await Brand.find({ status: "Active" }).sort({ createdAt: -1 });
  
      res.status(200).json({
        message: "Active brands fetched successfully",
        total: activeBrands.length,
        brands: activeBrands,
      });
    } catch (error) {
      console.error("Get Active Brands Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };


  exports.deleteBrand = async (req, res) => {
    try {
      const { id } = req.params;
      const brand = await Brand.findById(id);
  
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
  
      // Delete associated Cloudinary images
      const deletePromises = brand.image.map((img) =>
        cloudinary.uploader.destroy(img.public_id)
      );
      await Promise.all(deletePromises);
  
      await brand.deleteOne();
  
      res.status(200).json({ message: "Brand deleted successfully" });
    } catch (error) {
      console.error("Delete Brand Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  
  

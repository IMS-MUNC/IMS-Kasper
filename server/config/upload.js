const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary/cloudinary");

// configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads/",
    allowed_formats: ["jpg", "png", "jpeg", "gif", "pdf", "xlsx", "xls"],
    resource_type: "auto",
    transformation: [{ width: 800, height: 800, crop: "limit" }],
    filename_override: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

const upload = multer({ storage });
module.exports = upload;

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// File filter to accept images, csv, xlsx and pdf
const fileFilter = function (req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".gif", ".csv", ".xlsx", ".pdf"];
  const allowedMimes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
    "application/pdf",
  ];
  if (allowedExtensions.includes(ext) || allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image, CSV, Excel, or PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;



// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   },
// });

// const upload = multer({
//   storage,
//   fileFilter: function (req, file, cb) {
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (![".png", ".jpg", ".jpeg"].includes(ext)) {
//       return cb(new Error("Only images are allowed"), false);
//     }
//     cb(null, true);
//   },
// });

// module.exports = upload;


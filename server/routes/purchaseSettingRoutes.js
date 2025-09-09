// const express = require("express");
// const router = express.Router();
// const {
//     getSettings,
//     updateSettings,
// } = require("../controllers/purchaseSettingController");

// // GET Settings
// router.get("/get", getSettings);

// // PUT Update Settings
// router.put("/update", updateSettings);

// module.exports = router;

const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/purchaseSettingController");
const  {authMiddleware}=require("../middleware/auth.js")

// Optional: add auth middleware to protect updateSettings route
// const { protect, admin } = require("../middleware/authMiddleware");

router.get("/get",authMiddleware, getSettings);
router.put("/update", authMiddleware, updateSettings);

module.exports = router;


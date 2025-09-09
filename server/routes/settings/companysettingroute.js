const express = require("express");
const { sendCompanyProfile, getCompanyProfile } = require("../../controllers/settings/CompanySettingController.js");
const upload = require("../../config/upload.js")

const companysettingrouter = express.Router();

companysettingrouter.post("/send", upload.fields([
    { name: "companyIcon", maxCount: 1 },
    { name: "companyFavicon", maxCount: 1 },
    { name: "companyLogo", maxCount: 1 },
    { name: "companyDarkLogo", maxCount: 1 },
    
]), sendCompanyProfile);
// fetch route
companysettingrouter.get("/get", getCompanyProfile)

module.exports = companysettingrouter;

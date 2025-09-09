const companysettingModal = require("../../models/settings/companysettingmodal");

const sendCompanyProfile = async (req, res) => {
  try {
    const {
      companyName,
      companyemail,
      companyphone,
      companyfax,
      companywebsite,
      companyaddress,
      companycountry,
      companystate,
      companycity,
      companypostalcode,
      gstin,
      cin,
      companydescription
    } = req.body;

     const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/;
    const cinRegex = /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

       if (!gstinRegex.test(gstin)) {
      return res.status(400).json({ success: false, message: "Invalid GSTIN format" });
    }
    if (!cinRegex.test(cin)) {
      return res.status(400).json({ success: false, message: "Invalid CIN format" });
    }


    const existingProfile = await companysettingModal.findOne();
    

    const updatedData = {
      companyName,
      companyemail,
      companyphone,
      companyfax,
      companywebsite,
      companyaddress,
      companycountry,
      companystate,
      companycity,
      companypostalcode,
      gstin,
      cin,
      companydescription,
      companyIcon: req.files?.companyIcon?.[0]?.path || existingProfile?.companyIcon || "",
      companyFavicon: req.files?.companyFavicon?.[0]?.path || existingProfile?.companyFavicon || "",
      companyLogo: req.files?.companyLogo?.[0]?.path || existingProfile?.companyLogo || "",
      companyDarkLogo: req.files?.companyDarkLogo?.[0]?.path || existingProfile?.companyDarkLogo || "",
    };
    let savedCompanyProfile;
    if (existingProfile) {
      savedCompanyProfile = await companysettingModal.findByIdAndUpdate(
        existingProfile._id,
        updatedData,
        {new:true}
      )
    } else {
      // create
      const companyprofile = new companysettingModal(updatedData)
      savedCompanyProfile = await companyprofile.save();
    }
    res.status(201).json({
      success: true,
      message: existingProfile ? "Company Profile updated" : "Company Profile created",
      data: savedCompanyProfile,
    });
  } catch (error) {
    console.error("Error in sending company profile", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send company profile",
      error:
        typeof error === "object" ? JSON.stringify(error) : error.toString(),
    });
  }
};
// get logic
const getCompanyProfile = async (req, res) => {
  try {
    const companyProfile = await companysettingModal
      .findOne()
      .sort({ createdAt: -1 });
    if (!companyProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Company profile not found" });
    }
    res.status(200).json({ success: true, data: companyProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching profile" });
    console.error("Error", error);
  }
};

module.exports = { sendCompanyProfile, getCompanyProfile };

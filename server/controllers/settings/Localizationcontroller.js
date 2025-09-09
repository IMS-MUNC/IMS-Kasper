const localizationSettingModal = require("../../models/settings/LocalizationModal");

const sendLocalization = async (req, res) => {
  try {
    const {
      language,
      timezone,
      dateformat,
      timeformat,
      financialyear,
      startingmonth,
      currency,
      currencysymbol,
      currencyposition,
      decimalseparator,
      thousandseparator,
      } = req.body;
      
      const existingLocalization = await localizationSettingModal.findOne();

      const updatedLocalization = req.body;
      let savedLocalization;
      if (existingLocalization) {
          savedLocalization = await localizationSettingModal.findByIdAndUpdate(
              existingLocalization._id,
              updatedLocalization,
              {new:true}
          )
      } else {
        //   create
        const localizationsetting = new localizationSettingModal(updatedLocalization)
          savedLocalization = await localizationsetting.save();
      }
      res.status(201).json({
          success: true,
          message: existingLocalization ? "Localization setting updated" : "Localization setting created",
          data: savedLocalization,
      })
  } catch (error) {
      console.error("Error in sending localization", error)
    return res
      .status(500)
      .json({ success: false, message: "Error while saving Localization", error:typeof error === "object" ? JSON.stringify(error) : error.toString() });
  }
};

const getLocalization = async (req, res) => {
    try {
        const localizationsetting = await localizationSettingModal.findOne().sort({ createdAt: -1 });
        if (!localizationsetting) {
            return res.status(404).json({success:false, message:"Localization setting not found"})
        }
        res.status(200).json({success:true, data: localizationsetting})
    } catch (error) {
        res.status(500).json({ success: false, message:"Error fetching localization"})
        console.error("Error", error)
    }
}

module.exports = { sendLocalization, getLocalization }

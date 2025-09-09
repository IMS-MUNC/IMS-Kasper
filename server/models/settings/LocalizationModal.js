const mongoose = require("mongoose")
const LocalizationSettingsSchema = new mongoose.Schema({
    language: { type: String },
    timezone: { type: String },
    dateformat: { type: String },
    timeformat: { type: String },
    financialyear: { type: String },
    startingmonth: { type: String },
    currency: { type: String },
    currencysymbol: { type: String },
    currencyposition: { type: String },
    decimalseparator: { type: String },
    thousandseparator:{type:String}
},
    {
    timestamps:true
})

const localizationSettingModal = new mongoose.model("LocalizationSettings", LocalizationSettingsSchema)

module.exports = localizationSettingModal;
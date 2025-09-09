const mongoose = require("mongoose");

const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/;

const cinRegex = /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

const companysettingSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  companyemail: { type: String, required: true },
  companyphone: { type: String, required: true },
  companyfax: { type: String, required: true },
  companywebsite: { type: String, required: true },
  companyaddress: { type: String, required: true },
  companycountry: { type: String, required: true },
  companystate: { type: String, required: true },
  companycity: { type: String, required: true },
  companypostalcode: { type: Number, required: true },
  gstin:{
    type:String,
    required:true,
    match:[gstinRegex, "Invalid GSTIN format"]
  },
  cin:{
    type:String,
    required:true,
    match:[cinRegex, "Invalid CIN format"]
  },
  companydescription:{type:String},
  companyIcon: { type: String },
  companyFavicon: { type: String },
  companyLogo: { type: String },
  companyDarkLogo:{type:String},

}, {
    timestamps:true,
});

const companysettingModal = mongoose.model("companysetting", companysettingSchema);
module.exports = companysettingModal;

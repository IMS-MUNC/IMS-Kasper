const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  name: String,
  address1: String,
  address2: String,
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
  state: { type: mongoose.Schema.Types.ObjectId, ref: 'State' },
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
  postalCode: String,
}, { _id: false });

const SupplierSchema = new mongoose.Schema({
  supplierCode: { type: String, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  companyName: { type: String, required: true },
  companyWebsite: { type: String, required: true },
  businessType: { type: String, required: true },
  gstin: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  billing: AddressSchema,
  shipping: AddressSchema,
  status: { type: Boolean, default: true },
  bank: {
    bankName: String,
    branch: String,
    accountHolder: String,
    accountNumber: String,
    ifsc: String,
  },
  images: [
    {
      url: { type: String },
      public_id: { type: String }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Supplier', SupplierSchema);


// const mongoose = require('mongoose');

// const SupplierSchema = new mongoose.Schema({
//   supplierCode: { type: String, unique: true },
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   businessType: { type: String, required: true },
//   gstin: { type: String, required: true },
//   email: { type: String, required: true },
//   phone: { type: String, required: true },
//   address: { type: String, required: true },
//   city: { type: String },
//   state: { type: String },
//   country: { type: String },
//   postalCode: { type: String },
//   status: { type: Boolean, default: true },
//   bank: {
//     bankName: String,
//     branch: String,
//     accountHolder: String,
//     accountNumber: String,
//     ifsc: String,
//   },
//   images: [
//     {
//       url: { type: String },
//       public_id: { type: String }
//     }
//   ]}, { timestamps: true });

// module.exports = mongoose.model('Supplier', SupplierSchema);

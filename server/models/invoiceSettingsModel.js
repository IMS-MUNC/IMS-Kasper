const mongoose = require('mongoose');

const invoiceSettingsSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', },
    logo: { type: String },
    invoicePrefix: { type: String, default: 'INV' },
    invoiceColor: { type: String },
    invoiceTemplate: { type: String },
    showTax: { type: Boolean, default: true },
    showDiscount: { type: Boolean, default: true },
    showShipping: { type: Boolean, default: true },
    showNotes: { type: Boolean, default: true },
    showTerms: { type: Boolean, default: true },
    terms: { type: String },
    notes: { type: String },
    headerTerms: { type: String },
    footerTerms: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InvoiceSettings', invoiceSettingsSchema);

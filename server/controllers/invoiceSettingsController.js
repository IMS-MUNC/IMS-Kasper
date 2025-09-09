const InvoiceSettings = require('../models/invoiceSettingsModel');

exports.createInvoiceSettings = async (req, res) => {
    try {
        const settings = new InvoiceSettings(req.body);
        await settings.save();
        res.status(201).json(settings);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getInvoiceSettings = async (req, res) => {
    try {
        const settings = await InvoiceSettings.find({ company: req.query.company });
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateInvoiceSettings = async (req, res) => {
    try {
        const settings = await InvoiceSettings.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(settings);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

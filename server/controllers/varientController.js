const Warranty = require("../models/VariantModel");

const createVariant = async (req, res) => {
    try {
        const newWarranty = new Warranty(req.body);
        await newWarranty.save();
        res.status(201).json(newWarranty);
    } catch (err) {
        res.status(400).json({ Error: err.message });
    }
};

const getVariant = async (req, res) => {
    try {
        const warrantys = await Warranty.find();
        res.status(200).json(warrantys);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
};

const updateVariant = async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedWarranty = await Warranty.findByIdAndUpdate(userId, req.body, { new: true });
        res.status(200).json({ message: "updated : " }, updatedWarranty);
    } catch (err) {
        res.status(400).json({ Error: err.message });
    }
};

const deleteVariant = async (req, res) => {
    try {
        const { id } = req.params; // Extract ID from request parameters

        const deletedWarranty = await Warranty.findByIdAndDelete(id);

        if (!deletedWarranty) {
            return res.status(404).json({ error: 'Warranty not found' });
        }

        // Use 200 OK to return a response body
        res.status(200).json({ message: 'Warranty deleted successfully', data: deletedWarranty });
    } catch (err) {
        console.error('Error deleting warranty:', err); // Log error for debugging
        res.status(500).json({ error: 'Failed to delete warranty', details: err.message });
    }
};

module.exports = { createVariant, getVariant, updateVariant, deleteVariant };
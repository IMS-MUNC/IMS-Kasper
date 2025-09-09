const Product = require('../models/productModels');
const Purchase = require('../models/purchaseModels');
const Sale = require('../models/salesModels');

// GET /api/dashboard/inventory-summary?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
exports.getInventorySummary = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const dateFilter = {};
        if (startDate) dateFilter.$gte = new Date(startDate);
        if (endDate) dateFilter.$lte = new Date(endDate);

        // Get all products
        const products = await Product.find();

        // Aggregate purchase and sale quantities per product
        const purchaseAgg = await Purchase.aggregate([
            startDate || endDate ? { $match: { date: dateFilter } } : {},
            { $group: { _id: '$productId', totalPurchase: { $sum: '$quantity' } } }
        ]);
        const saleAgg = await Sale.aggregate([
            startDate || endDate ? { $match: { date: dateFilter } } : {},
            { $group: { _id: '$productId', totalSale: { $sum: '$quantity' } } }
        ]);

        // Map productId to quantities
        const purchaseMap = Object.fromEntries(purchaseAgg.map(p => [p._id.toString(), p.totalPurchase]));
        const saleMap = Object.fromEntries(saleAgg.map(s => [s._id.toString(), s.totalSale]));

        // Prepare response
        const summary = products.map(product => ({
            productId: product._id,
            name: product.name,
            sellQuantity: saleMap[product._id.toString()] || 0,
            purchaseQuantity: purchaseMap[product._id.toString()] || 0,
            availableQuantity: product.stock || 0
        }));

        res.json({ summary });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

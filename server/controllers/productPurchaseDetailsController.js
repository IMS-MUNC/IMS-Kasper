const Product = require('../models/productModels');

// Get purchasedetails by productId
exports.getProductPurchaseDetails = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId) {
            return res.status(400).json({ message: 'Product ID required' });
        }
        const product = await Product.findById(productId).select('purchases');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ purchases: product.purchases });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

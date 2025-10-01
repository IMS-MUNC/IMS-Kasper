const StockHistory = require('../models/stockHistoryModels');
const Product = require('../models/productModels'); // Add this if not already imported

exports.getStockHistory = async (req, res) => {
    try {
        const { productName, startDate, endDate, page = 1, limit = 10 } = req.query;
        const query = {};

        if (startDate || endDate) query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);

        // Filter by product name if provided
        if (productName) {
            const matchingProducts = await Product.find({
                productName: { $regex: productName, $options: 'i' },
            }).select('_id');

            const matchingIds = matchingProducts.map((p) => p._id);
            query.product = { $in: matchingIds };
        }

        const logsRaw = await StockHistory.find(query)
            .populate({
                path: 'product',
                populate: [
                    { path: 'hsn', model: 'HSN' },
                    { path: 'supplier', model: 'Supplier' }
                ]
            })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ date: -1 });

        // Add hsnCode and image to each log's product
        const logs = logsRaw.map(log => {
            let hsnCode = '';
            let image = '';
            let supplierName = '';
            if (log.product) {
                // HSN code extraction from populated hsn object
                if (log.product.hsn && typeof log.product.hsn === 'object' && log.product.hsn !== null) {
                    hsnCode = log.product.hsn.code || log.product.hsn.hsnCode || log.product.hsn.name || '';
                } else if (log.product.hsnCode) {
                    hsnCode = log.product.hsnCode;
                } else if (typeof log.product.hsn === 'string') {
                    hsnCode = log.product.hsn;
                }
                // Supplier name extraction from populated supplier object
                if (log.product.supplier && typeof log.product.supplier === 'object' && log.product.supplier !== null) {
                    if (log.product.supplier.firstName && log.product.supplier.lastName) {
                        supplierName = `${log.product.supplier.firstName} ${log.product.supplier.lastName}`;
                    } else if (log.product.supplier.companyName) {
                        supplierName = log.product.supplier.companyName;
                    } else if (log.product.supplier.supplierName) {
                        supplierName = log.product.supplier.supplierName;
                    } else {
                        supplierName = log.product.supplier._id || '';
                    }
                } else if (typeof log.product.supplier === 'string') {
                    supplierName = log.product.supplier;
                }
                if (Array.isArray(log.product.images) && log.product.images.length > 0) {
                    image = log.product.images[0].url;
                }
            }
            return {
                ...log._doc,
                product: log.product ? {
                    ...log.product._doc,
                    hsnCode,
                    image,
                    supplierName
                } : null
            };
        });

        const count = await StockHistory.countDocuments(query);

        res.json({
            success: true,
            logs,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalRecords: count,
        });
    } catch (error) {
        console.error("Error fetching stock history:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


exports.updateStockHistory = async (req, res) => {
    try {
        const updatedLog = await StockHistory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('product');

        if (!updatedLog) {
            return res.status(404).json({ success: false, message: "Log not found" });
        }

        res.json({ success: true, message: "Stock history updated", log: updatedLog });
    } catch (error) {
        console.error("Error updating stock history:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.deleteStockHistory = async (req, res) => {
    try {
        const deleted = await StockHistory.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Log not found" });
        }

        res.json({ success: true, message: "Stock history deleted" });
    } catch (error) {
        console.error("Error deleting stock history:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getStockHistoryTotals = async (req, res) => {
    try {
        const { productName, startDate, endDate } = req.query;
        const matchQuery = {};

        // Apply date filters
        if (startDate || endDate) matchQuery.date = {};
        if (startDate) matchQuery.date.$gte = new Date(startDate);
        if (endDate) matchQuery.date.$lte = new Date(endDate);

        // Filter by product name if provided
        if (productName) {
            const matchingProducts = await Product.find({
                productName: { $regex: productName, $options: 'i' },
            }).select('_id');

            const matchingIds = matchingProducts.map((p) => p._id);
            matchQuery.product = { $in: matchingIds };
        }

        // Use MongoDB aggregation to calculate totals efficiently
        const aggregationPipeline = [
            { $match: matchQuery },
            {
                $group: {
                    _id: null,
                    totalQuantity: {
                        $sum: {
                            $cond: [
                                { $ne: [{ $toLower: "$type" }, "return"] },
                                { $toDouble: "$quantityChanged" },
                                0
                            ]
                        }
                    },
                    totalPrice: {
                        $sum: {
                            $cond: [
                                { $ne: [{ $toLower: "$type" }, "return"] },
                                { $multiply: [{ $toDouble: "$priceChanged" }, { $toDouble: "$quantityChanged" }] },
                                0
                            ]
                        }
                    },
                    totalReturnQty: {
                        $sum: {
                            $cond: [
                                { $eq: [{ $toLower: "$type" }, "return"] },
                                { $abs: { $toDouble: "$quantityChanged" } },
                                0
                            ]
                        }
                    },
                    totalReturnPrice: {
                        $sum: {
                            $cond: [
                                { $eq: [{ $toLower: "$type" }, "return"] },
                                { $multiply: [{ $toDouble: "$priceChanged" }, { $abs: { $toDouble: "$quantityChanged" } }] },
                                0
                            ]
                        }
                    },
                    totalReturnAmount: {
                        $sum: {
                            $cond: [
                                { $eq: [{ $toLower: "$type" }, "return"] },
                                { $multiply: [{ $toDouble: "$priceChanged" }, { $abs: { $toDouble: "$quantityChanged" } }] },
                                0
                            ]
                        }
                    }
                }
            }
        ];

        const result = await StockHistory.aggregate(aggregationPipeline);
        
        const totals = result.length > 0 ? result[0] : {
            totalQuantity: 0,
            totalPrice: 0,
            totalReturnQty: 0,
            totalReturnPrice: 0,
            totalReturnAmount: 0
        };

        // Calculate available quantities
        const availableQty = totals.totalQuantity - totals.totalReturnQty;
        const availablePrice = totals.totalPrice - totals.totalReturnPrice;

        res.json({
            success: true,
            totals: {
                ...totals,
                availableQty,
                availablePrice
            }
        });
    } catch (error) {
        console.error("Error fetching stock history totals:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


// const StockHistory = require('../models/stockHistoryModels');

// exports.getStockHistory = async (req, res) => {
//     try {
//         const { product, startDate, endDate, page = 1, limit = 10 } = req.query;
//         const query = {};

//         if (product) query.product = product;
//         if (startDate || endDate) query.date = {};
//         if (startDate) query.date.$gte = new Date(startDate);
//         if (endDate) query.date.$lte = new Date(endDate);

//         const logs = await StockHistory.find(query)
//             .populate('product')
//             .skip((page - 1) * limit)
//             .limit(parseInt(limit))
//             .sort({ date: -1 });

//         const count = await StockHistory.countDocuments(query);

//         res.json({
//             success: true,
//             logs,
//             totalPages: Math.ceil(count / limit),
//             currentPage: parseInt(page),
//             totalRecords: count,
//         });
//     } catch (error) {
//         console.error("Error fetching stock history:", error);
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// };

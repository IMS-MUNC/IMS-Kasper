const Purchase = require('../models/purchaseModels');
const DebitNote = require('../models/debitNoteModel');
const Sale = require('../models/salesModel');
const CreditNote = require('../models/creditNoteModels');
const Product = require('../models/productModels');

// GET /api/stock/summary
// Returns stock in, stock out, returns, and profit/loss for each product
exports.getStockSummary = async (req, res) => {
    try {
        // Get all products
        const products = await Product.find().populate('hsn');
        const summary = [];

        // Totals for all products
        let totalPurchaseQty = 0;
        let totalSaleQty = 0;
        let totalSaleReturn = 0;
        let totalProfit = 0;
        let totalPurchaseReturnQty = 0;
        let totalPurchaseAmount = 0;
        let totalSalesAmount = 0;
        let totalAvailableStockValue = 0;

        for (const product of products) {
            // Total purchased (stock in)
            const purchases = await Purchase.find({ 'products.product': product._id });
            let totalPurchased = 0;
            let totalPurchaseReturn = 0;
            let purchaseAmount = 0;
            let productPurchaseQty = 0;

            for (const purchase of purchases) {
                const matchingProducts = purchase.products.filter(
                    (p) => p.product.toString() === product._id.toString()
                );
                for (const prod of matchingProducts) {
                    totalPurchased += prod.quantity || 0;
                    productPurchaseQty += prod.quantity || 0;
                    totalPurchaseReturn += prod.returnQty || 0;
                    purchaseAmount +=
                        (prod.quantity - (prod.returnQty || 0)) * (prod.purchasePrice || 0);
                }
            }
            totalPurchaseQty += productPurchaseQty;

            // Debit Notes (purchase returns)
            const debitNotes = await DebitNote.find({ 'products.product': product._id });
            let debitNoteReturn = 0;
            for (const dn of debitNotes) {
                const matchingProducts = dn.products.filter(
                    (p) => p.product.toString() === product._id.toString()
                );
                for (const prod of matchingProducts) {
                    debitNoteReturn += prod.returnQty || 0;
                }
            }
            // Add to total purchase return qty
            totalPurchaseReturnQty += (totalPurchaseReturn + debitNoteReturn);

            // Total sold (saleQty) and sales returns (saleReturn)
            const sales = await Sale.find({
                $or: [
                    { 'products.product': product._id },
                    { 'products.productId': product._id },
                ],
            });
            let saleQty = 0;
            let salesAmount = 0;
            for (const sale of sales) {
                const matchingProducts = sale.products.filter((p) => {
                    if (p.product && p.product.toString() === product._id.toString())
                        return true;
                    if (p.productId && p.productId.toString() === product._id.toString())
                        return true;
                    return false;
                });
                for (const prod of matchingProducts) {
                    saleQty += prod.quantity || 0;
                    salesAmount +=
                        (prod.quantity - (prod.returnQty || 0)) *
                        (prod.salePrice || prod.sellingPrice || 0);
                }
            }
            totalSaleQty += saleQty;

            // Credit Notes (sales returns)
            const creditNotes = await CreditNote.find({
                $or: [
                    { 'products.product': product._id },
                    { 'products.productId': product._id },
                ],
            });
            let saleReturn = 0;
            for (const cn of creditNotes) {
                const matchingProducts = cn.products.filter((p) => {
                    if (p.product && p.product.toString() === product._id.toString())
                        return true;
                    if (p.productId && p.productId.toString() === product._id.toString())
                        return true;
                    return false;
                });
                for (const prod of matchingProducts) {
                    saleReturn += prod.returnQty || 0;
                }
            }
            totalSaleReturn += saleReturn;

            // Stock in/out calculation
            const baseProductQty =
                typeof product.quantity === 'number' ? product.quantity : 0;
            const stockIn = baseProductQty + totalPurchased - debitNoteReturn;
            const stockOut = saleQty - saleReturn;
            const purchaseReturn = totalPurchaseReturn + debitNoteReturn;
            const currentStock = stockIn - stockOut - purchaseReturn + saleReturn;

            // Profit/Loss
            const profit = salesAmount - purchaseAmount;
            // Latest purchase price
            const allProductPurchases = purchases
                .map((purchase) =>
                    purchase.products.find(
                        (p) => p.product.toString() === product._id.toString()
                    )
                )
                .filter(Boolean);

            let availablePrice = 0;
            if (allProductPurchases.length > 0) {
                availablePrice =
                    allProductPurchases[allProductPurchases.length - 1].purchasePrice || 0;
            }

            totalProfit += profit;
            totalPurchaseAmount += purchaseAmount;
            totalSalesAmount += salesAmount;
            totalAvailableStockValue += (currentStock * availablePrice);

            console.log(
                `Product: ${product.productName} | Sold: ${saleQty} | Sale Return: ${saleReturn} | StockOut: ${stockOut}`
            );

            summary.push({
                product: product.productName,
                productId: product._id,
                image:
                    product.images && product.images.length > 0
                        ? product.images[0].url
                        : null,
                hsnCode:
                    product.hsn?.hsnCode || product.hsnCode || product.hsn || '',
                stockIn,
                saleQty,
                saleReturn,
                stockOut,
                purchaseReturn,
                currentStock,
                availableQty: currentStock,
                availablePrice,
                purchaseAmount,
                salesAmount,
                profit,
            });
        } // <-- ✅ properly closes for-loop

        res.json({
            summary,
            totals: {
                totalPurchaseQty,
                totalSaleQty: totalSaleQty - totalSaleReturn, // net sale quantity
                totalSaleReturn,
                totalPurchaseReturnQty,
                totalPurchaseAmount,
                totalSalesAmount,
                totalAvailableStockValue,
                totalProfit,
            },
        });
    } catch (err) {
        console.error('Error in getStockSummary:', err);
        res.status(500).json({ error: 'Failed to get stock summary' });
    }
};

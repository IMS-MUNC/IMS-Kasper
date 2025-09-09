const Product = require('../../models/productModels');
const StockHistory = require('../../models/stockHistoryModels');
const Purchase = require('../../models/purchaseModels');

async function handleProductReturn({ productId, returnQty, purchasePrice, referenceNumber, date, purchaseId }) {
  const qty = Math.abs(Number(returnQty));
  if (!productId || qty <= 0) return;

  // 1. Update product stock
  await Product.findByIdAndUpdate(productId, {
    $inc: { quantity: -qty },
    $push: {
      newPurchasePrice: purchasePrice,
      newQuantity: -qty,
    },
  });

  // 2. Update returnQty in Purchase
  if (purchaseId) {
    const purchase = await Purchase.findById(purchaseId);
    if (purchase) {
      const item = purchase.products.find(p => p.product.toString() === productId.toString());
      if (item) {
        item.returnQty = (Number(item.returnQty) || 0) + qty;
        item.quantity = Math.max(0, item.quantity - qty);
        await purchase.save();
      }
    }
  }

  // 3. Log to StockHistory
  await StockHistory.create({
    product: productId,
    date,
    quantityChanged: -qty,
    quantityReturned: qty,
    priceChanged: purchasePrice,
    type: 'return',
    notes: `Debit Note for purchase ref: ${referenceNumber}`,
  });
}

module.exports = { handleProductReturn };

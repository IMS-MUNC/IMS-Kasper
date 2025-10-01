
const CreditNote = require('../models/creditNoteModels');
const Sales = require('../models/salesModel');
const Product = require('../models/productModels');
const StockHistory = require('../models/soldStockHistoryModel');

// Helper to generate next creditNoteId
async function getNextCreditNoteId() {
  const last = await CreditNote.findOne().sort({ createdAt: -1 });
  if (!last || !last.creditNoteId) return 'CN0001';
  const num = parseInt(last.creditNoteId.replace('CN', ''));
  const nextNum = isNaN(num) ? 1 : num + 1;
  return 'CN' + nextNum.toString().padStart(4, '0');
}

exports.createCreditNote = async (req, res) => {
  try {
    // Auto-generate creditNoteId
    if (!req.body.creditNoteId) {
      req.body.creditNoteId = await getNextCreditNoteId();
    }

    // Clean ObjectId fields
    const cleanBody = { ...req.body };
    ['billFrom', 'billTo', 'sale'].forEach(field => {
      if (cleanBody[field] === '') delete cleanBody[field];
    });

    // Format products into credit note items
    if (Array.isArray(cleanBody.products)) {
      cleanBody.items = cleanBody.products.map(p => ({
        productService: p.productName || '',
        productId: p.productId,
        hsnCode: p.hsnCode || '',
        quantity: p.quantity,
        unit: p.unitName || p.unit || '',
        rate: p.sellingPrice,
        discount: p.discount,
        tax: p.tax,
        amount: (p.quantity * p.sellingPrice) - (p.discount || 0) + (((p.quantity * p.sellingPrice - (p.discount || 0)) * (p.tax || 0)) / 100)
      }));
      // Accept grandTotal and total from frontend
      if (typeof cleanBody.grandTotal !== 'undefined') cleanBody.total = cleanBody.grandTotal;
      delete cleanBody.products;
    }

    const creditNote = new CreditNote(cleanBody);
    await creditNote.save();

    // Return handling logic: update product stock & history
    if (Array.isArray(req.body.products) && cleanBody.sale) {
      const sale = await Sales.findById(cleanBody.sale);
      if (!sale) {
        return res.status(404).json({ message: 'Referenced sale not found' });
      }
      const reference = sale.referenceNumber;
      for (const item of req.body.products) {
        const { productId, quantity, sellingPrice } = item;
        if (!productId || !quantity) continue;
        // Add back to product stock
        await Product.findByIdAndUpdate(productId, {
          $inc: { availableQty: Math.abs(quantity) }
        });
        // Update sale product quantity
        const saleItem = sale.products.find(p => p.productId.toString() === productId);
        if (saleItem) {
          saleItem.quantity = Math.max(0, saleItem.quantity - Math.abs(quantity));
        }
        // Create stock history entry for return
        await StockHistory.create({
          product: productId,
          date: new Date(),
          quantity: Math.abs(quantity),
          priceChanged: sellingPrice || 0,
          type: 'RETURN',
          notes: `Credit Note for ref: ${reference}`,
        });
      }
      await sale.save();
    }
    res.status(201).json({ success: true, data: creditNote });
  } catch (err) {
    console.error('Credit Note Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};


// GET all credit notes
exports.getAllCreditNotes = async (req, res) => {
  try {
    const creditNotes = await CreditNote.find()
      .populate('billFrom')
      .populate('billTo')
      .populate({
        path: 'sale',
        populate: {
          path: 'customer',
          select: 'name images',
        },
      })
      .populate('items.productId');
    // Also populate customer directly for convenience
    await CreditNote.populate(creditNotes, [
      { path: 'sale.customer', select: 'name images' },
      { path: 'billFrom', select: 'name images' },
      { path: 'billTo', select: 'name images' }
    ]);
    res.json({ success: true, data: creditNotes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET all credit notes for a sale
exports.getAllCreditNotesBySale = async (req, res) => {
  try {
    const { saleId } = req.params;
    if (!saleId) return res.status(400).json({ success: false, error: 'saleId required' });
    const creditNotes = await CreditNote.find({ sale: saleId })
      .populate('billFrom')
      .populate('billTo')
      .populate({
        path: 'sale',
        populate: {
          path: 'customer',
          select: 'name images',
        },
      })
      .populate('items.productId');
    // Also populate customer directly for convenience
    await CreditNote.populate(creditNotes, [
      { path: 'sale.customer', select: 'name images' },
      { path: 'billFrom', select: 'name images' },
      { path: 'billTo', select: 'name images' }
    ]);
    res.json({ success: true, data: creditNotes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

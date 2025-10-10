const DebitNote = require('../models/debitNoteModel');
const Purchase = require('../models/purchaseModels');
const Product = require('../models/productModels');
const StockHistory = require('../models/stockHistoryModels');




// Helper to generate next debitNoteId
async function getNextDebitNoteId() {
  const last = await DebitNote.findOne().sort({ createdAt: -1 });
  if (!last || !last.debitNoteId) return 'DN0001';
  const num = parseInt(last.debitNoteId.replace('DN', ''));
  const nextNum = isNaN(num) ? 1 : num + 1;
  return 'DN' + nextNum.toString().padStart(4, '0');
}

exports.createProductReturn = async (req, res) => {
  try {
    // 1. Auto-generate debitNoteId
    if (!req.body.debitNoteId) {
      req.body.debitNoteId = await getNextDebitNoteId();
    }

    // 2. Clean up fields
    // const cleanBody = { ...req.body };
    // ['billFrom', 'billTo', 'purchase'].forEach(field => {
    //   if (cleanBody[field] === '') delete cleanBody[field];
    // });
    // 2. Clean up fields and ensure ObjectId for billFrom/billTo
    const cleanBody = { ...req.body };
    ['billFrom', 'billTo', 'purchase'].forEach(field => {
      if (!cleanBody[field] || cleanBody[field] === '') {
        delete cleanBody[field];
      } else if (typeof cleanBody[field] === 'object' && cleanBody[field]._id) {
        cleanBody[field] = cleanBody[field]._id;
      }
    });


    // 3. Prepare product & item arrays
    const finalProducts = [];
    cleanBody.items = [];

    if (Array.isArray(cleanBody.products)) {
      cleanBody.products.forEach(p => {
        const returnQty = Number(p.returnQty) || 0;
        const price = Number(p.purchasePrice) || 0;
        const discount = Number(p.discount) || 0;
        const tax = Number(p.tax) || 0;
        const discountType = p.discountType || '';
        const subTotal = returnQty * price;
        // let discountAmount = 0;
        // if (discountType === 'Percentage') {
        //   discountAmount = (subTotal * discount) / 100;
        // } else {
        //   discountAmount = discount;
        // }
          let discountAmount = 0;
    if (p.discountType === 'Percentage') {
      discountAmount = (subTotal * discount) / 100;
    } else {
      discountAmount = discount * returnQty;
    }
        const taxableValue = subTotal - discountAmount;
        const taxAmount = (taxableValue * tax) / 100;
        const total = taxableValue + taxAmount;

        finalProducts.push({
          product: p.productId || p._id,
          quantity: Number(p.quantity) - returnQty,
          returnQty,
          unit: p.unit || '',
          purchasePrice: price,
          discount,
          discountType,
          discountAmount,
          subTotal,
          tax,
          taxAmount,
          unitCost: price,
          totalCost: total,
        });

        cleanBody.items.push({
          product: p.productId || p._id,
          quantity: returnQty,
          unit: p.unit || '',
          purchasePrice: price,
          discount,
          tax,
          taxAmount,
          subTotal,
          discountType,
          discountAmount,
          unitCost: price,
          totalCost: total,
          quantityReturned: returnQty,
        });
      });

      cleanBody.products = finalProducts;
    }

    // 4. Fetch purchase details for reference number, supplier, etc.
    let relatedPurchase = null;
    let relatedPurchasePopulated = null;
    if (cleanBody.purchase) {
      // Fetch populated for read-only fields
      relatedPurchasePopulated = await Purchase.findById(cleanBody.purchase)
        .populate("supplier", "name")
        .populate("products.product", "name");

      if (!relatedPurchasePopulated) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      // Add purchase fields to debit note if not sent from frontend
      if (!cleanBody.referenceNumber) {
        cleanBody.referenceNumber = relatedPurchasePopulated.referenceNumber;
      }

      // If billFrom is not set, set it from purchase, and also attach supplierName
      if (!cleanBody.billFrom) {
        cleanBody.billFrom = relatedPurchasePopulated.billFrom;
        // Attach supplierName to the address if possible
        if (cleanBody.billFrom && relatedPurchasePopulated.supplier && relatedPurchasePopulated.supplier.name) {
          if (typeof cleanBody.billFrom === 'object' && !Array.isArray(cleanBody.billFrom)) {
            cleanBody.billFrom.supplierName = relatedPurchasePopulated.supplier.name;
          }
        }
      }

      if (!cleanBody.billTo) {
        cleanBody.billTo = relatedPurchasePopulated.billTo;
      }

      // Fetch the actual document for updating/saving
      relatedPurchase = await Purchase.findById(cleanBody.purchase);
    }

    // 4. Create debit note
    const debitNote = new DebitNote({
      debitNoteId: cleanBody.debitNoteId,
      referenceNumber: cleanBody.referenceNumber,
      debitNoteDate: cleanBody.debitNoteDate || new Date(),
      dueDate: cleanBody.dueDate,
      status: cleanBody.status || 'Pending',
      currency: cleanBody.currency || 'USD',
      enableTax: cleanBody.enableTax || false,
      billFrom: cleanBody.billFrom,
      billTo: cleanBody.billTo,
      products: cleanBody.products,
      extraInfo: cleanBody.extraInfo || {},
      amount: cleanBody.amount || 0,
      cgst: cleanBody.cgst || 0,
      sgst: cleanBody.sgst || 0,
      discount: cleanBody.discount || '0',
      roundOff: cleanBody.roundOff || false,
      total: cleanBody.total || 0,
      totalInWords: cleanBody.totalInWords || '',
      signature: cleanBody.signature || '',
      signatureName: cleanBody.signatureName || '',
      signatureImage: cleanBody.signatureImage || '',
      purchase: cleanBody.purchase?._id || cleanBody.purchase || null,
      items: cleanBody.items,
    });


    await debitNote.save();

    // 5. Link this debit note to the related purchase by referenceNumber (if not already linked)
    if (cleanBody.referenceNumber) {
      // Find the purchase by referenceNumber
      const purchaseDoc = await Purchase.findOne({ referenceNumber: cleanBody.referenceNumber });
      if (purchaseDoc) {
        // Add a 'debitNotes' array if not present
        if (!purchaseDoc.debitNotes) purchaseDoc.debitNotes = [];
        // Only add if not already present
        if (!purchaseDoc.debitNotes.some(id => id.toString() === debitNote._id.toString())) {
          purchaseDoc.debitNotes.push(debitNote._id);
          await purchaseDoc.save();
        }
      }
    }

    // 6. Update Purchase (reduce quantity, increase returnQty)
    if (relatedPurchase) {
      for (const item of cleanBody.products) {
        const { product: productId, returnQty = 0, purchasePrice } = item;
        const qty = parseFloat(returnQty);
        if (!productId || qty <= 0) continue;

        // a. Update Product stock
        await Product.findByIdAndUpdate(productId, {
          $inc: { quantity: -qty },
          $push: {
            newPurchasePrice: purchasePrice,
            newQuantity: -qty,
          },
        });

        // b. Update Purchase product returnQty
        const purchaseItem = relatedPurchase.products.find(p =>
          p.product.toString() === productId.toString()
        );

        if (purchaseItem) {
          purchaseItem.returnQty = (Number(purchaseItem.returnQty) || 0) + qty;
        }

        // c. Add to StockHistory
        await StockHistory.create({
          product: productId,
          date: new Date(),
          quantityChanged: -qty,
          quantityReturned: qty,
          priceChanged: purchasePrice,
          type: 'return',
          notes: `Debit Note for purchase ref: ${relatedPurchase.referenceNumber}`,
        });
      }

      await relatedPurchase.save();
    }

    // 7. Done
    return res.status(201).json({
      message: 'Debit Note created successfully',
      data: debitNote,
      finalProducts,
    });

  } catch (error) {
    console.error('Error creating debit note:', error);
    return res.status(500).json({
      message: 'Failed to create debit note',
      error: error.message,
    });
  }
};

// exports.getAllDebit = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = "", startDate, endDate } = req.query;

//     const filter = {};

//     if (search) {
//       filter.$or = [
//         { referenceNumber: { $regex: search, $options: "i" } },
//         { debitNoteId: { $regex: search, $options: "i" } },
//         { "purchase.supplier": { $regex: search, $options: "i" } },
//       ];
//     }

//     if (startDate && endDate) {
//       filter.returnDate = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate),
//       };
//     }

//     const skip = (page - 1) * limit;

//     const total = await DebitNote.countDocuments(filter);

//     const debitNotes = await DebitNote.find(filter)
//       .populate({
//         path: "purchase",
//         select: "referenceNumber supplier status purchaseDate",
//       })
//       .populate({
//         path: "products.product",
//         select: "name sku stock quantity image",
//       })
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(Number(limit));

//     res.status(200).json({
//       total,
//       totalPages: Math.ceil(total / limit),
//       currentPage: Number(page),
//       debitNotes,
//     });
//   } catch (error) {
//     console.error("Error fetching debit notes:", error);
//     res.status(500).json({ message: "Failed to fetch debit notes", error });
//   }
// };


exports.getAllDebit = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", startDate, endDate } = req.query;

    const filter = {};

    // Search on referenceNumber, debitNoteId
    if (search) {
      filter.$or = [
        { referenceNumber: { $regex: search, $options: "i" } },
        { debitNoteId: { $regex: search, $options: "i" } },
      ];
    }

    // Date range filtering
    if (startDate && endDate) {
      filter.debitNoteDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const skip = (page - 1) * limit;

    const total = await DebitNote.countDocuments(filter);


    const debitNotes = await DebitNote.find(filter)
      .populate({
        path: 'purchase',
        select: 'referenceNumber supplier status purchaseDate images productName',
        populate: {
          path: 'supplier',
          select: 'name'
        }
      })
      .populate({
        path: 'products.product',
        select: 'productName sku stock quantity images'
      })
      .populate({
        path: 'billFrom',
        select: 'name email address firstName lastName',
      })
      .populate({
        path: 'billTo',
        select: 'name email address firstName lastName',
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Ensure billFrom and billTo are always objects with string fields for frontend
    const safeDebitNotes = debitNotes.map(note => {
      const safe = note.toObject();
      if (safe.billFrom && typeof safe.billFrom === 'object') {
        // Only keep string fields
        safe.billFrom = {
          name: safe.billFrom.name || '',
          firstName: safe.billFrom.firstName || '',
          lastName: safe.billFrom.lastName || '',
          email: safe.billFrom.email || ''
        };
      }
      if (safe.billTo && typeof safe.billTo === 'object') {
        safe.billTo = {
          name: safe.billTo.name || '',
          firstName: safe.billTo.firstName || '',
          lastName: safe.billTo.lastName || '',
          email: safe.billTo.email || ''
        };
      }
      return safe;
    });

    res.status(200).json({
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      debitNotes: safeDebitNotes,
    });
  } catch (error) {
    console.error("Error fetching debit notes:", error);
    res.status(500).json({ message: "Failed to fetch debit notes", error });
  }
};


exports.createDebitNote = async (req, res) => {
  try {
    // 1. Auto-generate debitNoteId if not provided
    if (!req.body.debitNoteId) {
      req.body.debitNoteId = await getNextDebitNoteId();
    }

    // 2. Clean empty string ObjectId fields
    const cleanBody = { ...req.body };
    ['billFrom', 'billTo', 'purchase'].forEach(field => {
      if (cleanBody[field] === '') delete cleanBody[field];
    });

    // 3. Prepare items array from products array
    if (Array.isArray(cleanBody.products)) {
      cleanBody.items = cleanBody.products.map(p => {
        const returnQty = Number(p.returnQty) || 0;
        const price = Number(p.purchasePrice) || 0;
        const discount = Number(p.discount) || 0;
        const tax = Number(p.tax) || 0;

        const baseAmount = returnQty * price - discount;
        const taxAmount = (baseAmount * tax) / 100;
        const total = baseAmount + taxAmount;

        return {
          product: p.productId,
          quantity: returnQty,
          unit: p.unit || '',
          purchasePrice: price,
          discount,
          tax,
          taxAmount,
          unitCost: price,
          totalCost: total,
          quantityReturned: returnQty,
        };
      });
    }

    // 4. Create DebitNote document
    const debitNote = new DebitNote({
      debitNoteId: cleanBody.debitNoteId,
      referenceNumber: cleanBody.referenceNumber,
      debitNoteDate: cleanBody.debitNoteDate || new Date(),
      dueDate: cleanBody.dueDate,
      status: cleanBody.status || 'Pending',
      currency: cleanBody.currency || 'USD',
      enableTax: cleanBody.enableTax || false,
      billFrom: cleanBody.billFrom,
      billTo: cleanBody.billTo,
      products: cleanBody.products,
      extraInfo: cleanBody.extraInfo || {},
      amount: cleanBody.amount || 0,
      cgst: cleanBody.cgst || 0,
      sgst: cleanBody.sgst || 0,
      discount: cleanBody.discount || '0',
      roundOff: cleanBody.roundOff || false,
      total: cleanBody.total || 0,
      totalInWords: cleanBody.totalInWords || '',
      signature: cleanBody.signature || '',
      signatureName: cleanBody.signatureName || '',
      signatureImage: cleanBody.signatureImage || '',
      purchase: cleanBody.purchase || null,
      items: cleanBody.items,
    });

    await debitNote.save();

    // 5. Update product stock, purchase quantity, and stock history
    if (Array.isArray(cleanBody.products) && cleanBody.purchase) {
      const relatedPurchase = await Purchase.findById(cleanBody.purchase);
      if (relatedPurchase) {
        for (const item of cleanBody.products) {
          const { productId, returnQty = 0, purchasePrice } = item;
          const qty = parseFloat(returnQty);
          if (!productId || qty <= 0) continue;

          // ✅ 1. Update product stock (reduce)
          await Product.findByIdAndUpdate(productId, {
            $inc: { quantity: -qty },
          });

          // ✅ 2. Update quantity in the purchase object
          const purchaseProduct = relatedPurchase.products.find(p => p.product.toString() === productId.toString());
          if (purchaseProduct) {
            purchaseProduct.quantity = Math.max(0, purchaseProduct.quantity - qty);
          }

          // ✅ 3. Log stock return in history
          await StockHistory.create({
            product: productId,
            date: new Date(),
            quantityChanged: -qty,
            quantityReturned: qty,
            priceChanged: purchasePrice,
            type: 'return',
            notes: `Debit Note for purchase ref: ${relatedPurchase.referenceNumber}`,
          });
        }

        await relatedPurchase.save();
      }
    }

    // 6. Return success response
    return res.status(201).json({
      message: 'Debit Note created successfully',
      data: debitNote,
    });

  } catch (error) {
    console.error('Error creating debit note:', error);
    return res.status(500).json({
      message: 'Failed to create debit note',
      error: error.message,
    });
  }
};

exports.getAllDebitNotes = async (req, res) => {
  try {
    const notes = await DebitNote.find()
      .populate({
        path: 'purchase',
        select: 'referenceNumber supplier status purchaseDate',
        populate: { path: 'supplier', select: 'name' }
      })
      .populate({
        path: 'products.product',
        select: 'name sku stock quantity image'
      })
      .populate('billFrom')
      .populate('billTo');
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDebitNoteById = async (req, res) => {
  try {
    const note = await DebitNote.findById(req.params.id)
      .populate({
        path: 'purchase',
        select: 'referenceNumber supplier status purchaseDate',
        populate: { path: 'supplier', select: 'name' }
      })
      .populate({
        path: 'products.product',
        select: 'name sku stock quantity image'
      })
      .populate('billFrom')
      .populate('billTo');
    if (!note) return res.status(404).json({ error: 'Not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDebitNote = async (req, res) => {
  try {
    const note = await DebitNote.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDebitNote = async (req, res) => {
  try {
    await DebitNote.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNextDebitNoteId = async (req, res) => {
  try {
    const nextId = await getNextDebitNoteId();
    res.json({ nextId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Dashboard summary: total debit note amount and count
exports.getDebitNoteSummary = async (req, res) => {
  try {
    // Optionally filter by purchaseId if provided
    const { purchaseId } = req.query;
    const filter = {};
    if (purchaseId) {
      filter.purchase = purchaseId;
    }
    // Find all matching debit notes
    const notes = await DebitNote.find(filter);
    // Calculate total amount and count
    const totalAmount = notes.reduce((sum, note) => sum + (Number(note.total) || 0), 0);
    const totalCount = notes.length;
    res.json({ totalAmount, totalCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

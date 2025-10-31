
const CreditNote = require('../models/creditNoteModels');
const Sales = require('../models/salesModel');
const Product = require('../models/productModels');
const StockHistory = require('../models/soldStockHistoryModel');
const Customer = require('../models/customerModel');

// Helper to generate next creditNoteId
async function getNextCreditNoteId() {
  const last = await CreditNote.findOne().sort({ createdAt: -1 });
  if (!last || !last.creditNoteId) return 'CN0001';
  const num = parseInt(last.creditNoteId.replace('CN', ''));
  const nextNum = isNaN(num) ? 1 : num + 1;
  return 'CN' + nextNum.toString().padStart(4, '0');
}

// exports.createCreditNote = async (req, res) => {
//   try {
//     // Auto-generate creditNoteId
//     if (!req.body.creditNoteId) {
//       req.body.creditNoteId = await getNextCreditNoteId();
//     }
//     // Check for duplicate creditNoteId
//     const existingCreditNote = await CreditNote.findOne({ creditNoteId: req.body.creditNoteId });
//     if (existingCreditNote) {
//       return res.status(400).json({ success: false, error: 'Credit Note ID already exists. Please refresh and try again.' });
//     }


//     // Clean and robustly map all fields from AddCreditNoteModal
//     const cleanBody = { ...req.body };
//     // Remove empty string fields for ObjectIds
//     ['billFrom', 'billTo', 'sale', 'customer'].forEach(field => {
//       if (cleanBody[field] === '') delete cleanBody[field];
//     });

//     // Map billing and shipping address objects (from selectedBilling/selectedShipping)
//     if (cleanBody.billing && typeof cleanBody.billing === 'object' && cleanBody.billing.value !== undefined) {
//       // If billing is a select option, replace with address object
//       if (cleanBody.customer) {
//         const customerDoc = await Customer.findById(cleanBody.customer);
//         if (customerDoc && Array.isArray(customerDoc.billing)) {
//           cleanBody.billing = customerDoc.billing[cleanBody.billing.value] || customerDoc.billing[0] || {};
//         } else if (customerDoc && customerDoc.billing) {
//           cleanBody.billing = customerDoc.billing;
//         }
//       }
//     }
//     if (cleanBody.shipping && typeof cleanBody.shipping === 'object' && cleanBody.shipping.value !== undefined) {
//       if (cleanBody.customer) {
//         const customerDoc = await Customer.findById(cleanBody.customer);
//         if (customerDoc && Array.isArray(customerDoc.shipping)) {
//           cleanBody.shipping = customerDoc.shipping[cleanBody.shipping.value] || customerDoc.shipping[0] || {};
//         } else if (customerDoc && customerDoc.shipping) {
//           cleanBody.shipping = customerDoc.shipping;
//         }
//       }
//     }

//     // Format products into credit note items (robust mapping)
//     if (Array.isArray(cleanBody.products)) {
//       cleanBody.items = cleanBody.products.map(p => ({
//         productId: p.productId || p._id,

//         productName: p.productName,
//         hsnCode: p.hsnCode || p.hsn || (p.hsnDetails ? p.hsnDetails.hsnCode : ""),
//         saleQty: p.saleQty || p.quantity || 1,
//         quantity: p.returnQty || p.quantity || 1,
//         sellingPrice: p.sellingPrice,
//         discount: p.discount,
//         discountType: p.discountType,
//         tax: p.tax,
//         unit: p.unit || p.unitName || "",
//         images: p.images || [],
//         subTotal: p.subTotal,
//         discountAmount: p.discountAmount,
//         taxableAmount: p.taxableAmount,
//         taxAmount: p.taxAmount,
//         lineTotal: p.lineTotal,
//         unitCost: p.unitCost,
//         returnQty: p.returnQty,
//       }));
//       if (typeof cleanBody.grandTotal !== 'undefined') cleanBody.total = cleanBody.grandTotal;
//       delete cleanBody.products;
//     }

//     // Ensure sale field is set if present in payload
//     if (!cleanBody.sale && cleanBody.referenceNumber) {
//       // Try to find sale by referenceNumber
//       const saleDoc = await Sales.findOne({ referenceNumber: cleanBody.referenceNumber });
//       if (saleDoc) cleanBody.sale = saleDoc._id;
//     }

//     // Add createdBy and updatedBy from req.user if available
//     if (req.user) {
//       cleanBody.createdBy = {
//         name: req.user.firstName + ' ' + req.user.lastName,
//         email: req.user.email
//       };
//       cleanBody.updatedBy = {
//         name: req.user.firstName + ' ' + req.user.lastName,
//         email: req.user.email
//       };
//     }

//     const creditNote = new CreditNote(cleanBody);
//     await creditNote.save();

//     // Return handling logic: update product stock & history
//     if (Array.isArray(req.body.products) && cleanBody.sale) {
//       const sale = await Sales.findById(cleanBody.sale);
//       if (!sale) {
//         return res.status(404).json({ message: 'Referenced sale not found' });
//       }
//       const reference = sale.referenceNumber;
//       for (const item of req.body.products) {
//         const { productId, quantity, sellingPrice } = item;
//         if (!productId || !quantity) continue;
//         // Add back to product stock
//         await Product.findByIdAndUpdate(productId, {
//           $inc: { availableQty: Math.abs(quantity) }
//         });
//         // Update sale product quantity
//         const saleItem = sale.products.find(p => p.productId.toString() === productId);
//         if (saleItem) {
//           saleItem.quantity = Math.max(0, saleItem.quantity - Math.abs(quantity));
//         }
//         // Create stock history entry for return
//         await StockHistory.create({
//           product: productId,
//           date: new Date(),
//           quantity: Math.abs(quantity),
//           soldQuantity: Math.abs(quantity), // Required field for validation
//           priceChanged: sellingPrice || 0,
//           type: 'RETURN',
//           notes: `Credit Note for ref: ${reference}`,
//         });
//       }
//       await sale.save();
//     }
//     res.status(201).json({ success: true, data: creditNote });
//   } catch (err) {
//     console.error('Credit Note Error:', err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };


// GET all credit notes

// 🔹 Create Credit Note
exports.createCreditNote = async (req, res) => {
  try {
    // ✅ Auto-generate creditNoteId if not provided
    if (!req.body.creditNoteId) {
      req.body.creditNoteId = await getNextCreditNoteId();
    }

    // ✅ Prevent duplicate creditNoteId
    const existingCreditNote = await CreditNote.findOne({ creditNoteId: req.body.creditNoteId });
    if (existingCreditNote) {
      return res.status(400).json({
        success: false,
        error: "Credit Note ID already exists. Please refresh and try again.",
      });
    }

    // ✅ Clean body
    const cleanBody = { ...req.body };

    // Remove empty string ObjectIds
    ["billFrom", "billTo", "sale", "customer"].forEach(field => {
      if (cleanBody[field] === "") delete cleanBody[field];
    });

    // ✅ Map billing address from customer
    if (cleanBody.billing?.value !== undefined && cleanBody.customer) {
      const customerDoc = await Customer.findById(cleanBody.customer);
      if (customerDoc) {
        if (Array.isArray(customerDoc.billing)) {
          cleanBody.billing = customerDoc.billing[cleanBody.billing.value] || customerDoc.billing[0] || {};
        } else {
          cleanBody.billing = customerDoc.billing || {};
        }
      }
    }

    // ✅ Map shipping address from customer
    if (cleanBody.shipping?.value !== undefined && cleanBody.customer) {
      const customerDoc = await Customer.findById(cleanBody.customer);
      if (customerDoc) {
        if (Array.isArray(customerDoc.shipping)) {
          cleanBody.shipping = customerDoc.shipping[cleanBody.shipping.value] || customerDoc.shipping[0] || {};
        } else {
          cleanBody.shipping = customerDoc.shipping || {};
        }
      }
    }

    // ✅ Format products (replacing items)
    if (Array.isArray(cleanBody.products)) {
      cleanBody.products = cleanBody.products.map(p => {
        let productName = p.productName;
        // Try to get productName from populated productId if not present
        if (!productName && p.productId && typeof p.productId === 'object' && p.productId.productName) {
          productName = p.productId.productName;
        }
        return {
          productId: p.productId || p._id,
          productName,
          hsnCode: p.hsnCode || p.hsn || (p.hsnDetails ? p.hsnDetails.hsnCode : ""),
          saleQty: p.saleQty || p.quantity || 1,
          quantity: p.returnQty || p.quantity || 1,
          sellingPrice: p.sellingPrice,
          discount: p.discount,
          discountType: p.discountType,
          tax: p.tax,
          unit: p.unit || p.unitName || "",
          images: p.images || [],
          subTotal: p.subTotal,
          discountAmount: p.discountAmount,
          taxableAmount: p.taxableAmount,
          taxAmount: p.taxAmount,
          lineTotal: p.lineTotal,
          unitCost: p.unitCost,
          returnQty: p.returnQty,
        };
      });

      if (typeof cleanBody.grandTotal !== "undefined") {
        cleanBody.total = cleanBody.grandTotal;
      }
    }

    // ✅ Ensure sale reference is linked if not set
    if (!cleanBody.sale && cleanBody.referenceNumber) {
      const saleDoc = await Sales.findOne({ referenceNumber: cleanBody.referenceNumber });
      if (saleDoc) cleanBody.sale = saleDoc._id;
    }

    // ✅ Add createdBy / updatedBy
    if (req.user) {
      cleanBody.createdBy = {
        name: `${req.user.firstName} ${req.user.lastName}`,
        email: req.user.email,
      };
      cleanBody.updatedBy = {
        name: `${req.user.firstName} ${req.user.lastName}`,
        email: req.user.email,
      };
    }


    // ✅ Save Credit Note
    const creditNote = new CreditNote(cleanBody);
    await creditNote.save();

    // 🔹 Link credit note to sale (push to creditNotes array)
    let saleToUpdate = null;
    if (cleanBody.sale) {
      saleToUpdate = await Sales.findById(cleanBody.sale);
    } else if (cleanBody.referenceNumber) {
      saleToUpdate = await Sales.findOne({ referenceNumber: cleanBody.referenceNumber });
    }
    if (saleToUpdate) {
      // Only push if not already present
      if (!saleToUpdate.creditNotes) saleToUpdate.creditNotes = [];
      if (!saleToUpdate.creditNotes.some(id => id.toString() === creditNote._id.toString())) {
        saleToUpdate.creditNotes.push(creditNote._id);
        await saleToUpdate.save();
      }
    }

    // ✅ Stock & Sale Updates (for returns)
    if (Array.isArray(req.body.products) && cleanBody.sale) {
      const sale = await Sales.findById(cleanBody.sale);
      if (!sale) {
        return res.status(404).json({ message: "Referenced sale not found" });
      }

      const reference = sale.referenceNumber;

      for (const item of req.body.products) {
        const { productId, quantity, sellingPrice } = item;
        if (!productId || !quantity) continue;

        // 🔹 Add returned qty back to stock
        await Product.findByIdAndUpdate(productId, {
          $inc: { availableQty: Math.abs(quantity) },
        });

        // 🔹 Update sale product qty
        const saleItem = sale.products.find(p => p.productId.toString() === productId);
        if (saleItem) {
          saleItem.quantity = Math.max(0, saleItem.quantity - Math.abs(quantity));
        }

        // 🔹 Stock history entry
        await StockHistory.create({
          product: productId,
          date: new Date(),
          quantity: Math.abs(quantity),
          soldQuantity: Math.abs(quantity), // ✅ consistent with schema
          priceChanged: sellingPrice || 0,
          type: "RETURN",
          notes: `Credit Note for ref: ${reference}`,
        });
      }

      await sale.save();
    }

    res.status(201).json({ success: true, data: creditNote });
  } catch (error) {
    console.error("Credit Note Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// // 🔹 GET all Credit Notes
// exports.getAllCreditNotes = async (req, res) => {
//   try {
//     // Support isDeleted filter like purchaseController
//     let filter = {};
//     if (typeof req.query.isDeleted !== 'undefined') {
//       filter.isDeleted = req.query.isDeleted === 'true';
//     } else {
//       filter.isDeleted = false; // Default: only show not deleted
//     }

//     // Pagination
//     let page = parseInt(req.query.page) || 1;
//     let limit = parseInt(req.query.limit) || 10;
//     if (page < 1) page = 1;
//     if (limit < 1) limit = 10;
//     const skip = (page - 1) * limit;

//     const [creditNotes, total] = await Promise.all([
//       CreditNote.find(filter)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .populate({
//           path: "customer",
//           select: "name email phone gstin billing  gstState",
//         })
//         .populate({
//           path: "billFrom",
//           select: "name email phone billing gstin",
//         })
//         .populate({
//           path: "billTo",
//           select: "name email phone billing gstin",
//         })
//         .populate({
//           path: "sale",
//           populate: {
//             path: "customer",
//             select: "name email phone gstin billing ",
//           },
//         })
//         .populate({
//           path: "products.productId",
//           select: "productName hsnCode images",
//         }),
//       CreditNote.countDocuments(filter)
//     ]);

//     res.status(200).json({
//       success: true,
//       count: creditNotes.length,
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//       data: creditNotes,
//     });
//   } catch (error) {
//     console.error("Error fetching Credit Notes:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };
exports.getAllCreditNotes = async (req, res) => {
  try {
    // Support isDeleted filter like purchaseController
    let filter = {};
    if (typeof req.query.isDeleted !== 'undefined') {
      filter.isDeleted = req.query.isDeleted === 'true';
    } else {
      filter.isDeleted = false; // Default: only show not deleted
    }

    // Pagination
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    const skip = (page - 1) * limit;

    // Fetch credit notes with customer, billFrom, billTo, sale.customer, and products.productId populated
    const [creditNotes, total] = await Promise.all([
      CreditNote.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "customer",
          select: "name email phone gstin gstState",
        })
        .populate({
          path: "billFrom",
          select: "name email phone billing gstin",
        })
        .populate({
          path: "billTo",
          select: "name email phone billing gstin",
        })
        .populate({
          path: "sale",
          populate: {
            path: "customer",
            select: "name email phone billing gstin",
          },
        })
        .populate({
          path: "products.productId",
          select: "productName hsnCode images",
        }),
      CreditNote.countDocuments(filter)
    ]);

    // Debug: log the first populated customer object
    // if (creditNotes.length > 0) {
    //   console.log("Populated customer in credit note:", creditNotes[0].customer);
    // }

    res.status(200).json({
      success: true,
      count: creditNotes.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: creditNotes,
    });
  } catch (error) {
    console.error("Error fetching Credit Notes:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// SOFT DELETE Credit Note
exports.softDeleteCreditNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await CreditNote.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!note) return res.status(404).json({ success: false, error: 'Credit Note not found' });
    res.json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// RESTORE Credit Note (undo soft delete)
exports.restoreCreditNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await CreditNote.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
    if (!note) return res.status(404).json({ success: false, error: 'Credit Note not found' });
    res.json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// HARD DELETE Credit Note
exports.hardDeleteCreditNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await CreditNote.findByIdAndDelete(id);
    if (!note) return res.status(404).json({ success: false, error: 'Credit Note not found' });
    res.json({ success: true, message: 'Credit Note permanently deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// old main code 
// exports.getAllCreditNotes = async (req, res) => {
//   try {
//     const creditNotes = await CreditNote.find()
//       .populate('billFrom')
//       .populate('billTo')
//       .populate({
//         path: 'sale',
//         populate: {
//           path: 'customer',
//           select: 'name images',
//         },
//       });
//     // Also populate customer directly for convenience
//     await CreditNote.populate(creditNotes, [
//       { path: 'sale.customer', select: 'name images' },
//       { path: 'billFrom', select: 'name images' },
//       { path: 'billTo', select: 'name images' }
//     ]);
//     res.json({ success: true, data: creditNotes });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

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
      .populate({
        path: 'items.productId',
        select: 'productName hsnCode images',
      });
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

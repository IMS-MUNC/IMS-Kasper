
const Product = require("../models/productModels");
const Purchase = require("../models/purchaseModels");
const StockHistory = require("../models/stockHistoryModels");
const cloudinary = require("../utils/cloudinary/cloudinary");
const Supplier = require('../models/supplierModel');
const DebitNote  = require('../models/debitNoteModel');
const {createAuditLog } = require("../utils/auditLogger")

function parseDDMMYYYY(dateStr) {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`);
}



exports.createPurchase = async (req, res) => {
    try {
    const {
      supplier,
      purchaseDate,
      referenceNumber,
      products,
      orderTax,
      orderDiscount,
      shippingCost,
      grandTotal,
      status,
      description,
      // --- Purchase Summary ---
      subTotal,
      discountAmount,
      taxableValue,
      taxAmount,
      cgst,
      sgst,
      totalItemCost,
      // Payment fields
      paymentType,
      paymentStatus,
      paidAmount,
      dueAmount,
      dueDate,
      paymentMethod,
      transactionId,
      transactionDate,
      onlineMethod
    } = req.body;

        // ✅ Validate required fields
        if (
            !supplier ||
            !purchaseDate ||
            !referenceNumber ||
            !products ||
            products.length === 0 ||
            !status ||
            !paymentType
        ) {
            return res.status(400).json({ message: 'Please fill all required fields.' });
        }

        const parsedDate = parseDDMMYYYY(purchaseDate);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: 'Invalid purchase date format. Use dd/mm/yyyy' });
        }

        const finalProducts = [];

    for (const item of products) {
      const {
        productId,
        quantity,
        unit = '',
        purchasePrice,
        returnQty,
        discount = 0,
        // discountType = 'Fixed',
          discountType: discountType,
          subTotal=0,
        discountAmount = 0,
        tax = 0,
        taxAmount = 0,
        unitCost = 0,
        totalCost = 0,
      } = item;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${productId}` });
      }

      // Update product quantity and push history
      await Product.findByIdAndUpdate(productId, {
        $inc: { quantity },
        $push: {
          newPurchasePrice: purchasePrice,
          newQuantity: quantity,
        },
      });

      // Stock history
      await StockHistory.create({
        product: productId,
        date: parsedDate,
        quantityChanged: quantity,
        priceChanged: purchasePrice,
        type: 'purchase',
        notes: `Purchase ref: ${referenceNumber}`,
      });

      // Calculate discountAmount if not sent (for safety)
      let calcDiscountAmount = discountAmount;
      if (!calcDiscountAmount) {
        if (discountType === 'Percentage') {
          calcDiscountAmount = ((quantity * purchasePrice) * discount) / 100;
        } else {
          calcDiscountAmount = discount;
        }
      }

      finalProducts.push({
        product: productId,
        quantity,
        unit,
        returnQty,
        purchasePrice,
        discount,
        discountType,
        subTotal,
        discountAmount: calcDiscountAmount,
        tax,
        taxAmount,
        unitCost,
        totalCost,
      });
    }

        // ✅ Upload images if provided
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            const uploadedImages = await Promise.all(
                req.files.map(file =>
                    cloudinary.uploader.upload(file.path, { folder: 'purchase_images' })
                )
            );

            imageUrls = uploadedImages.map(img => ({
                url: img.secure_url,
                public_id: img.public_id,
            }));
        }

        // ✅ Build purchase object
    const purchase = new Purchase({
      supplier,
      purchaseDate: parsedDate,
      referenceNumber,
      products: finalProducts,
      orderTax,
      orderDiscount,
      shippingCost,
      grandTotal,
      status,
      description,
      // --- Purchase Summary ---
      subTotal,
      discountAmount,
      taxableValue,
      taxAmount,
      cgst,
      sgst,
      totalItemCost,
      image: imageUrls,
      payment: {
        paymentType,
        paymentStatus,
        paidAmount,
        dueAmount,
        dueDate: dueDate ? new Date(dueDate) : null,
        paymentMethod,
        transactionId,
        transactionDate: transactionDate ? new Date(transactionDate) : null,
        onlineMethod,
      },
      createdBy: req.user ? {
        name: req.user.firstName + ' ' + req.user.lastName,
        email: req.user.email
      } : undefined,

      updatedBy: req.user ? {
        name: req.user.firstName + ' ' + req.user.lastName,
        email: req.user.email
      } : undefined,
    });

        await purchase.save();

        // Push purchase info into each product's purchases array
        for (const item of finalProducts) {
          await Product.findByIdAndUpdate(
            item.product,
            {
              $push: {
                purchases: {
                  referenceNumber,
                  purchaseId: purchase._id,
                  quantity: item.quantity,
                  purchasePrice: item.purchasePrice,
                  purchaseDate: parsedDate
                }
              }
            }
          );
        }
        // populate supplier and products for logging
        try {
        const populatedPurchase = await Purchase.findById(purchase._id).populate("supplier", "name").populate("products.product", products).lean();
        // create audit log
        await createAuditLog({
          user:req.user,
          module:"Purchase",
          action:"CREATE",
          description: `Created purchase for supplier: ${populatedPurchase?.supplier?.name || "-"} with ${populatedPurchase?.products?.length || 0} product(s)`,
          newData: populatedPurchase,
          req,
        });
         console.log("✅ Audit log created for purchase:", populatedPurchase._id);
} catch (err) {
  console.error("⚠️ Failed to create audit log for purchase:", err);
}
        res.status(201).json({ success: true, purchase });
    } catch (error) {
        console.error('Purchase creation failed:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getNextReferenceNumber = async (req, res) => {
    try {
        // Find the latest purchase entry
        const lastPurchase = await Purchase.findOne().sort({ createdAt: -1 });

        let nextNumber = 1;

        if (lastPurchase && lastPurchase.referenceNumber) {
            const match = lastPurchase.referenceNumber.match(/PUR-(\d+)/);
            if (match) {
                nextNumber = parseInt(match[1], 10) + 1;
            }
        }

        const newRef = `PUR-${String(nextNumber).padStart(3, "0")}`;
        res.status(200).json({ referenceNumber: newRef });
    } catch (error) {
        console.error("Error generating reference number:", error);
        res.status(500).json({ error: "Failed to generate reference number" });
    }
};


exports.getAllPurchases = async (req, res) => {
    try {
      const {
        search = "",
        status,
        supplier,
        productName,
        startDate,
        endDate,
        page = 1,
        limit = 10,
        isDeleted

      } = req.query;

        const query = { $and: [] };

        // Unified search: referenceNumber, supplier name, or product name
        if (search) {
            const matchingProductIds = await Product.find({
                productName: { $regex: search, $options: "i" }
            }).select("_id");

            const matchingSupplierIds = await Supplier.find({
                $or: [
                    { firstName: { $regex: search, $options: "i" } },
                    { lastName: { $regex: search, $options: "i" } },
                ]
            }).select("_id");

            query.$and.push({
                $or: [
                    { referenceNumber: { $regex: search, $options: "i" } },
                    { supplier: { $in: matchingSupplierIds.map(s => s._id) } },
                    { "products.product": { $in: matchingProductIds.map(p => p._id) } }
                ]
            });
        }

        if (status) query.$and.push({ status });
        if (supplier) query.$and.push({ supplier });

        if (startDate || endDate) {
            const dateQuery = {};
            if (startDate) dateQuery.$gte = new Date(startDate);
            if (endDate) dateQuery.$lte = new Date(endDate);
            query.$and.push({ purchaseDate: dateQuery });
        }

        if (productName) {
            const products = await Product.find({
                productName: { $regex: productName, $options: 'i' },
            }).select('_id');
            query.$and.push({
                "products.product": { $in: products.map(p => p._id) },
            });
        }

            // Add isDeleted filter
    if (typeof isDeleted !== 'undefined') {
      query.$and.push({ isDeleted: isDeleted === 'true' });
    } else {
      query.$and.push({ isDeleted: false }); // Default: only show not deleted
    }

        if (query.$and.length === 0) delete query.$and;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        const total = await Purchase.countDocuments(query);

        const purchases = await Purchase.find(query)
            // .populate("supplier", "firstName lastName email phone")
            .populate("supplier", "supplierCode firstName lastName companyName companyWebsite businessType gstin email phone billing shipping status bank images")
            .populate({
                path: "products.product",
                select: "productName sku warehouse",
                populate: {
                    path: "warehouse",
                    select: "warehouseName"
                }
            })
            .populate({ path: "debitNotes", populate: { path: "products.product" } })
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);

        res.status(200).json({
            success: true,
            totalRecords: total,
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            purchases,
        });
    } catch (error) {
        console.error("Error fetching purchases:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};



exports.updatePurchase = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            supplier,
            purchaseDate,
            products,
            referenceNumber,
            orderTax,
            orderDiscount,
            shippingCost,
            grandTotal,
            status,
            description,
            payment
        } = req.body;

        const parsedPayment = {
            paymentType: payment?.paymentType || "",
            paymentStatus: payment?.paymentStatus || "",
            paidAmount: Number(payment?.paidAmount) || 0,
            dueAmount: Number(payment?.dueAmount) || 0,
            dueDate: payment?.dueDate || null,
            paymentMethod: payment?.paymentMethod || "",
            transactionId: payment?.transactionId || "",
            transactionDate: payment?.transactionDate || null,
            onlineMethod: payment?.onlineMethod || "",
        };



        const parsedDate = parseDDMMYYYY(purchaseDate);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: 'Invalid purchase date format. Use dd/mm/yyyy' });
        }

        const finalProducts = [];

        for (const item of products) {
            const {
                productId,
                quantity,
                unit = '',
                purchasePrice,
                discount = 0,
                tax = 0,
                taxAmount = 0,
                unitCost = 0,
                totalCost = 0,
                returnQty = 0,
            } = item;

            // Ensure product exists
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${productId}` });
            }

            // Find and update the product in the purchase (by _id)
            // This ensures the purchase.products array is updated to match the modal
            // (Assumes you have the purchase object loaded as 'existingPurchase')
            // If not, you can load it here if needed

            // Push all fields including returnQty
            finalProducts.push({
                product: productId,
                quantity,
                returnQty,
                unit,
                purchasePrice,
                discount,
                tax,
                taxAmount,
                unitCost,
                totalCost,
            });

            // If returnQty is present and > 0, update product stock and log return in stock history
            if (returnQty && Number(returnQty) > 0) {
        // Subtract returned quantity from product stock
        await Product.findByIdAndUpdate(productId, {
          $inc: { quantity: -Math.abs(returnQty) },
          $push: {
            newPurchasePrice: purchasePrice,
            newQuantity: -Math.abs(returnQty),
            purchasedetails:[ {
              referenceNumber,
              purchaseId: id,
              quantity: -Math.abs(returnQty),
              purchasePrice,
              purchaseDate: parsedDate,
              discount,
              discountAmount,
              tax,
              taxAmount,
              unitCost,
              totalCost,
              unit,
              returnQty: Number(returnQty)
            }]
          },
        });

                // Log return in stock history
                await StockHistory.create({
                    product: productId,
                    date: parsedDate,
                    quantityChanged: -Math.abs(returnQty),
                    quantityReturned: Math.abs(returnQty),
                    priceChanged: purchasePrice,
                    type: 'return',
                    notes: `Return for purchase ref: ${referenceNumber}`,
                });
            }

            // Always log update to stock history for purchase-update
            await StockHistory.create({
                product: productId,
                date: parsedDate,
                quantityChanged: quantity,
                priceChanged: purchasePrice,
                type: 'purchase-update',
                notes: `Updated purchase ref: ${referenceNumber}`,
            });
        }

        // If updating an existing purchase, update its products array to match modal (by _id or product)
        // This ensures the purchase.products array is always in sync with the modal
        const existingPurchase = await Purchase.findById(id);
        if (existingPurchase) {
            finalProducts.forEach(fp => {
                // Try to match by product field first
                let match = existingPurchase.products.find(p => p.product && p.product.toString() === fp.product.toString());
                // If not found, try to match by _id (for legacy or populated docs)
                if (!match && fp._id) {
                    match = existingPurchase.products.find(p => p._id && p._id.toString() === fp._id.toString());
                }
                // If still not found, try to match by _id in fp (for frontend-provided _id)
                if (!match && fp._id) {
                    match = existingPurchase.products.find(p => p._id && p._id.toString() === fp._id.toString());
                }
                if (match) {
                    match.quantity = fp.quantity;
                    match.unit = fp.unit;
                    match.purchasePrice = fp.purchasePrice;
                    match.discount = fp.discount;
                    match.tax = fp.tax;
                    match.taxAmount = fp.taxAmount;
                    match.unitCost = fp.unitCost;
                    match.totalCost = fp.totalCost;
                    match.returnQty = fp.returnQty;
                }
            });
            await existingPurchase.save();
        }

        // ✅ Handle image upload if new images provided
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            const uploadedImages = await Promise.all(
                req.files.map(file =>
                    cloudinary.uploader.upload(file.path, { folder: 'purchase_images' })
                )
            );

            imageUrls = uploadedImages.map(img => ({
                url: img.secure_url,
                public_id: img.public_id,
            }));
        }

        // ✅ Build updated purchase payload
        const updatedPayload = {
            supplier,
            purchaseDate: parsedDate,
            referenceNumber,
            products: finalProducts,
            orderTax,
            orderDiscount,
            shippingCost,
            grandTotal,
            status,
            description,
            ...(imageUrls.length > 0 && { image: imageUrls }), // only update if new images are added
            payment: parsedPayment,
            // payment: {
            //     paymentType,
            //     paymentStatus,
            //     paidAmount,
            //     dueAmount,
            //     dueDate: dueDate ? new Date(dueDate) : null,
            //     paymentMethod,
            //     transactionId,
            //     transactionDate: transactionDate ? new Date(transactionDate) : null,
            //     onlineMethod,
            // }
        };

    // Add updatedBy info
    if (req.user) {
      updatedPayload.updatedBy = {
        name: req.user.firstName + ' ' + req.user.lastName,
        email: req.user.email
      };
    }
    const updatedPurchase = await Purchase.findByIdAndUpdate(id, updatedPayload, { new: true });

        if (!updatedPurchase) {
            return res.status(404).json({ message: 'Purchase not found' });
        }

        // if (!updatedPurchase) {
        //     return res.status(404).json({ message: "Purchase not found" });
        // }

        res.status(200).json({ message: "Purchase updated successfully", data: updatedPurchase });
    } catch (error) {
        console.error("Update Purchase Error:", error);
        res.status(500).json({ message: "Failed to update purchase", error: error.message });
    }
};


exports.deletePurchase = async (req, res) => {
    try {
        const { id } = req.params;

        const purchase = await Purchase.findById(id);
        if (!purchase) {
            return res.status(404).json({ message: 'Purchase not found' });
        }

        // 1. Revert product stock quantities
        for (const item of purchase.products) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { quantity: -item.quantity } // Revert stock
            });
        }

        // 2. Delete stock history related to this purchase
        await StockHistory.deleteMany({
            product: { $in: purchase.products.map(p => p.product) },
            notes: new RegExp(purchase.referenceNumber) // Matches purchase reference in stock history
        });

        // 3. Delete associated images from Cloudinary
        if (purchase.image && purchase.image.length > 0) {
            for (const img of purchase.image) {
                if (img.public_id) {
                    await cloudinary.uploader.destroy(img.public_id);
                }
            }
        }

        // 4. Finally, delete the purchase itself
        await Purchase.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: 'Purchase deleted successfully' });
    } catch (error) {
        console.error("Delete Purchase Error:", error);
        res.status(500).json({ success: false, message: "Failed to delete purchase", error: error.message });
    }
};



exports.getNextReferenceNumber = async (req, res) => {
    try {
        const lastPurchase = await Purchase.findOne().sort({ createdAt: -1 });
        let nextNumber = 1;

        if (lastPurchase?.referenceNumber) {
            const match = lastPurchase.referenceNumber.match(/PUR-(\d+)/);
            if (match) nextNumber = parseInt(match[1], 10) + 1;
        }

        const newRef = `PUR-${String(nextNumber).padStart(3, "0")}`;
        res.status(200).json({ referenceNumber: newRef });
    } catch (error) {
        console.error("Error generating reference number:", error);
        res.status(500).json({ error: "Failed to generate reference number" });
    }
};



exports.createProductReturn = async (req, res) => {
  try {
    // 1. Auto-generate debitNoteId
    if (!req.body.debitNoteId) {
      req.body.debitNoteId = await getNextDebitNoteId();
    }

    // 2. Clean up fields
    const cleanBody = { ...req.body };
    ['billFrom', 'billTo', 'purchase'].forEach(field => {
      if (cleanBody[field] === '') delete cleanBody[field];
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

        const baseAmount = returnQty * price - discount;
        const taxAmount = (baseAmount * tax) / 100;
        const total = baseAmount + taxAmount;

        finalProducts.push({
          product: p.productId || p._id,
          quantity: Number(p.quantity) - returnQty,
          returnQty,
          unit: p.unit || '',
          purchasePrice: price,
          discount,
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
          unitCost: price,
          totalCost: total,
          quantityReturned: returnQty,
        });
      });

      cleanBody.products = finalProducts;
    }

    // 4. Fetch purchase details for reference number, supplier, etc.
    let relatedPurchase = null;
    if (cleanBody.purchase) {
      relatedPurchase = await Purchase.findById(cleanBody.purchase)
        .populate("supplier", "name") // assuming supplier is a ref
        .populate("products.product", "name");

      if (!relatedPurchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      // Add purchase fields to debit note if not sent from frontend
      if (!cleanBody.referenceNumber) {
        cleanBody.referenceNumber = relatedPurchase.referenceNumber;
      }

      if (!cleanBody.billFrom) {
        cleanBody.billFrom = relatedPurchase.billFrom;
      }

      if (!cleanBody.billTo) {
        cleanBody.billTo = relatedPurchase.billTo;
      }
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





// GET /api/purchases/debit-notes
exports.getAllDebitNotes = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", startDate, endDate } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { referenceNumber: { $regex: search, $options: "i" } },
        { debitNoteId: { $regex: search, $options: "i" } },
        { "purchase.supplier": { $regex: search, $options: "i" } },
      ];
    }

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
        path: "purchase",
        select: "referenceNumber supplier status purchaseDate",
      })
      .populate({
        path: "products.product",
        select: "name sku stock quantity image",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      debitNotes,
    });
  } catch (error) {
    console.error("Error fetching debit notes:", error);
    res.status(500).json({ message: "Failed to fetch debit notes", error });
  }
};


 
exports.getAllReturns = async (req, res) => {
    try {
        const returns = await ProductReturn.find()
            .populate('originalPurchase', 'referenceNumber')
            .populate('supplier', 'firstName lastName')
            .populate('returnedProducts.product', 'productName');

        res.status(200).json({ success: true, returns });
    } catch (error) {
        console.error("Fetch Returns Error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


exports.updatePurchaseOnReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const { returnedProducts, returnAmount, referenceNumber } = req.body;

    const purchase = await Purchase.findById(id);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // Update product quantities and returnQty, match by product (ObjectId)
    returnedProducts.forEach((returnedItem) => {
      const product = purchase.products.find(p => {
        // Support both product and productId keys
        const prodId = p.product? p.product.toString() : (p.product ? p.product.toString() : '');
        return prodId === (returnedItem.product?.toString() || returnedItem.productId?.toString());
      });
      if (product) {
        product.quantity = Math.max(0, (Number(product.quantity) || 0) - (Number(returnedItem.returnQty) || 0));
        product.returnQty = (Number(product.returnQty) || 0) + (Number(returnedItem.returnQty) || 0);
      }
    });

    // Optionally track returns history with normalized returnedProducts
    purchase.returns = purchase.returns || [];
    purchase.returns.push({
      referenceNumber,
      returnedProducts: returnedProducts.map(rp => ({
        product: rp.product || rp.productId,
        returnQty: Number(rp.returnQty) || 0,
        unit: rp.unit || '',
        purchasePrice: Number(rp.purchasePrice) || 0,
        discount: Number(rp.discount) || 0,
        tax: Number(rp.tax) || 0,
        taxAmount: Number(rp.taxAmount) || 0,
        unitCost: Number(rp.unitCost) || 0,
        totalCost: Number(rp.totalCost) || 0,
      })),
      returnAmount,
      returnDate: new Date()
    });

    await purchase.save();

    res.status(200).json({ message: "Purchase updated with return info" });
  } catch (err) {
    console.error("Error updating purchase on return:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Purchase Report API
exports.getPurchaseReport = async (req, res) => {
  try {
    const { search = "", fromDate, toDate, page = 1, limit = 10 } = req.query;
    const query = { $and: [] };

    // Search by reference, supplier name, or product name
    if (search) {
      const matchingProductIds = await Product.find({
        productName: { $regex: search, $options: "i" }
      }).select("_id");
      const matchingSupplierIds = await Supplier.find({
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
        ]
      }).select("_id");
      query.$and.push({
        $or: [
          { referenceNumber: { $regex: search, $options: "i" } },
          { supplier: { $in: matchingSupplierIds.map(s => s._id) } },
          { "products.product": { $in: matchingProductIds.map(p => p._id) } }
        ]
      });
    }

    // Date filter
    if (fromDate || toDate) {
      const dateQuery = {};
      if (fromDate) dateQuery.$gte = new Date(fromDate);
      if (toDate) dateQuery.$lte = new Date(toDate);
      query.$and.push({ purchaseDate: dateQuery });
    }
    if (query.$and.length === 0) delete query.$and;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const totalRecords = await Purchase.countDocuments(query);

    const purchases = await Purchase.find(query)
  .populate("supplier", "firstName lastName")
  .populate("products.product", "productName")
  .populate({ path: "debitNotes", populate: { path: "products.product" } })
  .sort({ createdAt: -1 })
  .skip((pageNum - 1) * limitNum)
  .limit(limitNum);

    // Totals
    let totalPurchase = totalRecords;
    let totalQuantity = 0;
    let totalReturn = 0;
    purchases.forEach(p => {
      p.products.forEach(pr => {
        totalQuantity += pr.quantity || 0;
        totalReturn += pr.returnQty || 0;
      });
    });

    res.status(200).json({
      data: purchases,
      totals: {
        purchase: totalPurchase,
        quantity: totalQuantity,
        return: totalReturn,
      },
      pagination: {
        totalRecords,
        currentPage: pageNum,
        totalPages: Math.ceil(totalRecords / limitNum),
        pageSize: limitNum,
      },
    });
  } catch (error) {
    console.error("Purchase Report Error:", error);
    res.status(500).json({ message: "Failed to fetch report", error: error.message });
  }
};



exports.restorePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ID
    if (!id || id.length !== 24) {
      return res.status(400).json({ success: false, message: 'Invalid purchase ID' });
    }

    // ✅ Find purchase
    const purchase = await Purchase.findById(id);
    if (!purchase) {
      return res.status(404).json({ success: false, message: 'Purchase not found' });
    }

    // ✅ Check if already restored
    if (!purchase.isDeleted) {
      return res.status(400).json({ success: false, message: 'Purchase is already active' });
    }

    // ✅ Restore
    purchase.isDeleted = false;
    await purchase.save();

    res.status(200).json({
      success: true,
      message: 'Purchase restored successfully',
      data: purchase,
    });
  } catch (error) {
    console.error('Error restoring purchase:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while restoring purchase',
      error: error.message,
    });
  }
};

exports.permanentDeletePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ID
    if (!id || id.length !== 24) {
      return res.status(400).json({ success: false, message: 'Invalid purchase ID' });
    }

    // ✅ Find purchase
    const purchase = await Purchase.findById(id);
    if (!purchase) {
      return res.status(404).json({ success: false, message: 'Purchase not found' });
    }

    // ✅ Remove associated images from Cloudinary (if any)
    if (purchase.image && purchase.image.length > 0) {
      for (const img of purchase.image) {
        if (img.public_id) {
          try {
            await cloudinary.uploader.destroy(img.public_id);
          } catch (cloudErr) {
            console.error(`Cloudinary deletion failed for ${img.public_id}:`, cloudErr);
          }
        }
      }
    }

    // ✅ Remove related stock history entries
    if (purchase.products && purchase.products.length > 0) {
      await StockHistory.deleteMany({
        product: { $in: purchase.products.map((p) => p.product) },
        notes: new RegExp(purchase.referenceNumber, 'i'),
      });
    }

    // ✅ Delete the purchase itself
    await Purchase.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Purchase permanently deleted',
    });
  } catch (error) {
    console.error('Permanent Delete Purchase Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to permanently delete purchase',
      error: error.message,
    });
  }
};


// Soft delete a purchase (move to Trash)
exports.deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const purchase = await Purchase.findById(id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    purchase.isDeleted = true;
    await purchase.save();
    res.status(200).json({ success: true, message: 'Purchase moved to trash (soft deleted)' });
  } catch (error) {
    console.error('Soft Delete Purchase Error:', error);
    res.status(500).json({ success: false, message: 'Failed to soft delete purchase', error: error.message });
  }
};



// exports.createProductReturn = async (req, res) => {
//   try {
//     // 1. Auto-generate debitNoteId
//     if (!req.body.debitNoteId) {
//       req.body.debitNoteId = await getNextDebitNoteId();
//     }

//     // 2. Clean up fields
//     const cleanBody = { ...req.body };
//     ['billFrom', 'billTo', 'purchase'].forEach(field => {
//       if (cleanBody[field] === '') delete cleanBody[field];
//     });

//     // 3. Prepare product & item arrays
//     const finalProducts = [];
//     cleanBody.items = [];

//     if (Array.isArray(cleanBody.products)) {
//       cleanBody.products.forEach(p => {
//         const returnQty = Number(p.returnQty) || 0;
//         const price = Number(p.purchasePrice) || 0;
//         const discount = Number(p.discount) || 0;
//         const tax = Number(p.tax) || 0;

//         const baseAmount = returnQty * price - discount;
//         const taxAmount = (baseAmount * tax) / 100;
//         const total = baseAmount + taxAmount;

//         finalProducts.push({
//           product: p.productId,
//           quantity: Number(p.quantity) - returnQty,
//           returnQty,
//           unit: p.unit || '',
//           purchasePrice: price,
//           discount,
//           tax,
//           taxAmount,
//           unitCost: price,
//           totalCost: total,
//         });

//         cleanBody.items.push({
//           product: p.productId,
//           quantity: returnQty,
//           unit: p.unit || '',
//           purchasePrice: price,
//           discount,
//           tax,
//           taxAmount,
//           unitCost: price,
//           totalCost: total,
//           quantityReturned: returnQty,
//         });
//       });

//       cleanBody.products = finalProducts;
//     }

//     // 4. Create debit note
//     const debitNote = new DebitNote({
//       debitNoteId: cleanBody.debitNoteId,
//       referenceNumber: cleanBody.referenceNumber,
//       debitNoteDate: cleanBody.debitNoteDate || new Date(),
//       dueDate: cleanBody.dueDate,
//       status: cleanBody.status || 'Pending',
//       currency: cleanBody.currency || 'USD',
//       enableTax: cleanBody.enableTax || false,
//       billFrom: cleanBody.billFrom,
//       billTo: cleanBody.billTo,
//       products: cleanBody.products,
//       extraInfo: cleanBody.extraInfo || {},
//       amount: cleanBody.amount || 0,
//       cgst: cleanBody.cgst || 0,
//       sgst: cleanBody.sgst || 0,
//       discount: cleanBody.discount || '0',
//       roundOff: cleanBody.roundOff || false,
//       total: cleanBody.total || 0,
//       totalInWords: cleanBody.totalInWords || '',
//       signature: cleanBody.signature || '',
//       signatureName: cleanBody.signatureName || '',
//       signatureImage: cleanBody.signatureImage || '',
//       purchase: cleanBody.purchase || null,
//       items: cleanBody.items,
//     });

//     await debitNote.save();

//     // 5. If linked to a purchase, update products & stock history
//     if (Array.isArray(cleanBody.products) && cleanBody.purchase) {
//       const relatedPurchase = await Purchase.findById(cleanBody.purchase);
//       if (relatedPurchase) {
//         for (const item of cleanBody.products) {
//           const { product: productId, returnQty = 0, purchasePrice } = item;
//           const qty = parseFloat(returnQty);
//           if (!productId || qty <= 0) continue;

//           // a. Update Product stock
//           await Product.findByIdAndUpdate(productId, {
//             $inc: { quantity: -qty },
//             $push: {
//               newPurchasePrice: purchasePrice,
//               newQuantity: -qty,
//             },
//           });

//           // b. Update Purchase.product returnQty
//           const purchaseItem = relatedPurchase.products.find(p =>
//             p.product.toString() === productId.toString()
//           );
//           if (purchaseItem) {
//             purchaseItem.quantity = Math.max(0, purchaseItem.quantity - qty);
//             purchaseItem.returnQty = (Number(purchaseItem.returnQty) || 0) + qty;
//           }

//           // c. Create StockHistory
//           await StockHistory.create({
//             product: productId,
//             date: new Date(),
//             quantityChanged: -qty,
//             quantityReturned: qty,
//             priceChanged: purchasePrice,
//             type: 'return',
//             notes: `Debit Note for purchase ref: ${relatedPurchase.referenceNumber}`,
//           });
//         }

//         await relatedPurchase.save();
//       }
//     }

//     // 6. Response
//     return res.status(201).json({
//       message: 'Debit Note created successfully',
//       data: debitNote,
//       finalProducts,
//     });

//   } catch (error) {
//     console.error('Error creating debit note:', error);
//     return res.status(500).json({
//       message: 'Failed to create debit note',
//       error: error.message,
//     });
//   }
// };



// exports.createProductReturn = async (req, res) => {
//   try {
//     // 1. Auto-generate debitNoteId if not provided
//     if (!req.body.debitNoteId) {
//       req.body.debitNoteId = await getNextDebitNoteId();
//     }

//     // 2. Clean empty string ObjectId fields
//     const cleanBody = { ...req.body };
//     ['billFrom', 'billTo', 'purchase'].forEach(field => {
//       if (cleanBody[field] === '') delete cleanBody[field];
//     });

//     // 3. Prepare items array from products array
//     // if (Array.isArray(cleanBody.products)) {
//     //   cleanBody.items = cleanBody.products.map(p => {
//     //     const returnQty = Number(p.returnQty) || 0;
//     //     const price = Number(p.purchasePrice) || 0;
//     //     const discount = Number(p.discount) || 0;
//     //     const tax = Number(p.tax) || 0;

//     //     const baseAmount = returnQty * price - discount;
//     //     const taxAmount = (baseAmount * tax) / 100;
//     //     const total = baseAmount + taxAmount;

//     //     return {
//     //       product: p.productId,
//     //       quantity: returnQty,
//     //       unit: p.unit || '',
//     //       purchasePrice: price,
//     //       discount,
//     //       tax,
//     //       taxAmount,
//     //       unitCost: price,
//     //       totalCost: total,
//     //       quantityReturned: returnQty,
//     //     };
//     //   });
//     // }

//     // 3. Prepare items array from products array

    
// if (Array.isArray(cleanBody.products)) {
//   cleanBody.items = cleanBody.products.map(p => {
//     const returnQty = Number(p.returnQty) || 0;
//     const price = Number(p.purchasePrice) || 0;
//     const discount = Number(p.discount) || 0;
//     const tax = Number(p.tax) || 0;

//     const baseAmount = returnQty * price - discount;
//     const taxAmount = (baseAmount * tax) / 100;
//     const total = baseAmount + taxAmount;

//     return {
//       product: p.productId,
//       quantity: returnQty,
//       unit: p.unit || '',
//       purchasePrice: price,
//       discount,
//       tax,
//       taxAmount,
//       unitCost: price,
//       totalCost: total,
//       quantityReturned: returnQty,
//     };
//   });

//   // ✅ Update each product in the array with returnQty and normalized fields
//   cleanBody.products = cleanBody.products.map(p => ({
//     product: p.productId,
//     quantity: Number(p.quantity) || 0,
//     returnQty: Number(p.returnQty) || 0,
//     unit: p.unit || '',
//     purchasePrice: Number(p.purchasePrice) || 0,
//     discount: Number(p.discount) || 0,
//     tax: Number(p.tax) || 0,
//     taxAmount: Number(p.taxAmount) || 0,
//     unitCost: Number(p.unitCost) || 0,
//     totalCost: Number(p.totalCost) || 0,
//   }));
// }


//     // 4. Create DebitNote document
//     const debitNote = new DebitNote({
//       debitNoteId: cleanBody.debitNoteId,
//       referenceNumber: cleanBody.referenceNumber,
//       debitNoteDate: cleanBody.debitNoteDate || new Date(),
//       dueDate: cleanBody.dueDate,
//       status: cleanBody.status || 'Pending',
//       currency: cleanBody.currency || 'USD',
//       enableTax: cleanBody.enableTax || false,
//       billFrom: cleanBody.billFrom,
//       billTo: cleanBody.billTo,
//       products: cleanBody.products,
//       extraInfo: cleanBody.extraInfo || {},
//       amount: cleanBody.amount || 0,
//       cgst: cleanBody.cgst || 0,
//       sgst: cleanBody.sgst || 0,
//       discount: cleanBody.discount || '0',
//       roundOff: cleanBody.roundOff || false,
//       total: cleanBody.total || 0,
//       totalInWords: cleanBody.totalInWords || '',
//       signature: cleanBody.signature || '',
//       signatureName: cleanBody.signatureName || '',
//       signatureImage: cleanBody.signatureImage || '',
//       purchase: cleanBody.purchase || null,
//       items: cleanBody.items,
//     });

//     await debitNote.save();

//     // 5. Update product stock, purchase quantity, and stock history
//     if (Array.isArray(cleanBody.products) && cleanBody.purchase) {
//       const relatedPurchase = await Purchase.findById(cleanBody.purchase);
//       if (relatedPurchase) {
//         for (const item of cleanBody.products) {
//           const { productId, returnQty = 0, purchasePrice } = item;
//           const qty = parseFloat(returnQty);
//           if (!productId || qty <= 0) continue;

//           // ✅ 1. Update product stock (reduce)
//           await Product.findByIdAndUpdate(productId, {
//             $inc: { quantity: -qty },
//           });

//           // ✅ 2. Update quantity in the purchase object
//           const purchaseProduct = relatedPurchase.products.find(p => p.product.toString() === productId.toString());
//           if (purchaseProduct) {
//             purchaseProduct.quantity = Math.max(0, purchaseProduct.quantity - qty);
//           }

//           // ✅ 3. Log stock return in history
//           await StockHistory.create({
//             product: productId,
//             date: new Date(),
//             quantityChanged: -qty,
//             quantityReturned: qty,
//             priceChanged: purchasePrice,
//             type: 'return',
//             notes: `Debit Note for purchase ref: ${relatedPurchase.referenceNumber}`,
//           });
//         }

//         await relatedPurchase.save();
//       }
//     }

//     // 6. Return success response
//     return res.status(201).json({
//       message: 'Debit Note created successfully',
//       data: debitNote,
//     });

//   } catch (error) {
//     console.error('Error creating debit note:', error);
//     return res.status(500).json({
//       message: 'Failed to create debit note',
//       error: error.message,
//     });
//   }
// };

// // FINAL CODE 
// exports.createProductReturn = async (req, res) => {
//   try {
//     const {
//       debitNoteId,
//       purchase,
//       billFrom,
//       billTo,
//       products,
//       notes,
//       reason,
//       refundMethod,
//       refundStatus,
//     } = req.body;

//     // ✅ Validate required fields
//     if (!purchase || !Array.isArray(products) || products.length === 0) {
//       return res.status(400).json({ message: 'Missing required fields: purchase or products' });
//     }

//     // ✅ Find the related purchase
//     const relatedPurchase = await Purchase.findById(purchase);
//     if (!relatedPurchase) {
//       return res.status(404).json({ message: 'Referenced purchase not found' });
//     }

//     // ✅ Generate a debit note ID if not provided
//     const generatedId = debitNoteId || await generatedDebitNoteId();

//     const items = [];

//     for (const item of products) {
//       const {
//         productId,
//         productName,
//         quantity,
//         unitName,
//         purchasePrice,
//         discount = 0,
//         tax = 0,
//         taxAmount = 0,
//         unitCost = 0,
//         totalCost = 0,
//         returnQty = 0
//       } = item;

//       const qty = parseFloat(returnQty) || parseFloat(quantity) || 0;
//       if (!productId || qty <= 0) continue;

//       const baseAmount = qty * purchasePrice;
//       const finalAmount = (baseAmount - discount) * (1 + tax / 100);

//       // ✅ Add to debit note products array (match debitNoteController)
//       items.push({
//         product: productId,
//         quantity: qty,
//         unit: unitName || '',
//         returnQty: qty,
//         purchasePrice,
//         discount,
//         tax,
//         taxAmount,
//         unitCost,
//         totalCost,
//       });

//       // ✅ 1. Update product stock (reduce)
//       await Product.findByIdAndUpdate(productId, {
//         $inc: { quantity: -qty }
//       });

//       // ✅ 2. Update quantity in the purchase object
//       const purchaseProduct = relatedPurchase.products.find(p => p.product.toString() === productId.toString());
//       if (purchaseProduct) {
//         purchaseProduct.quantity = Math.max(0, purchaseProduct.quantity - qty);
//       }

//       // ✅ 3. Log stock return in history
//       await StockHistory.create({
//         product: productId,
//         date: new Date(),
//         quantityChanged: -qty,
//         quantityReturned: qty,
//         priceChanged: purchasePrice,
//         type: 'return',
//         notes: `Debit Note for purchase ref: ${relatedPurchase.referenceNumber}`,
//       });
//     }

//     // ✅ Save updated purchase
//     await relatedPurchase.save();

//     // ✅ Create and save the debit note
//     const newDebitNote = new DebitNote({
//       debitNoteId: generatedId,
//       purchase,
//       billFrom,
//       billTo,
//       products: items, // match debitNoteModel
//       notes,
//       reason,
//       refundMethod,
//       refundStatus,
//     });

//     await newDebitNote.save();

//     res.status(201).json({ success: true, data: newDebitNote });

//   } catch (error) {
//     console.error("Debit Note Error:", error);
//     res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// };

// exports.createProductReturn = async (req, res) => {
//   try {
//     const {
//       debitNoteId,
//       purchase,
//       billFrom,
//       billTo,
//       products,
//       notes,
//       reason,
//       refundMethod,
//       refundStatus,
//     } = req.body;

//     // Validate required fields
//     if (!purchase || !Array.isArray(products) || products.length === 0) {
//       return res.status(400).json({ message: 'Missing required fields: purchase or products' });
//     }

//     const relatedPurchase = await Purchase.findById(purchase);
//     if (!relatedPurchase) {
//       return res.status(404).json({ message: 'Referenced purchase not found' });
//     }

//     // Generate debit note ID if not provided
//     const generatedDebitNoteId = debitNoteId || await generatedDebitNoteId();

//     const items = [];
//     for (const item of products) {
//       const {
//         productId,
//         productName,
//         quantity,
//         unitName,
//         purchasePrice,
//         discount = 0,
//         tax = 0
//       } = item;

//       const qty = parseFloat(quantity);
//       if (!productId || qty <= 0) continue;

//       const baseAmount = qty * purchasePrice;
//       const finalAmount = (baseAmount - discount) * (1 + tax / 100);

//       items.push({
//         productService: productName || '',
//         quantity: qty,
//         unit: unitName || '',
//         rate: purchasePrice,
//         discount,
//         tax,
//         amount: finalAmount,
//       });

//       // 1. Update product stock
//       await Product.findByIdAndUpdate(productId, {
//         $inc: { quantity: -Math.abs(qty) }
//       });

//       // 2. Update purchase item quantity
//       const purchaseProduct = relatedPurchase.products.find(p => p.product.toString() === productId.toString());
//       if (purchaseProduct) {
//         purchaseProduct.quantity = Math.max(0, purchaseProduct.quantity - Math.abs(qty));
//       }

//       // 3. Log stock history
//       await StockHistory.create({
//         product: productId,
//         date: new Date(),
//         quantityChanged: -Math.abs(qty),
//         priceChanged: purchasePrice,
//         type: 'return',
//         notes: `Debit Note for purchase ref: ${relatedPurchase.referenceNumber}`,
//       });
//     }

//     await relatedPurchase.save();

//     // Save new debit note
//     const newDebitNote = new debitNoteId({
//       debitNoteId: generatedDebitNoteId,
//       purchase,
//       billFrom,
//       billTo,
//       items,
//       notes,
//       reason,
//       refundMethod,
//       refundStatus,
//     });

//     await newDebitNote.save();

//     res.status(201).json({ success: true, data: newDebitNote });

//   } catch (error) {
//     console.error("Debit Note Error:", error);
//     res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// };

// Get all Debit Notes with populated purchase and product info
// exports.getAllDebitNotes = async (req, res) => {
//   try {
//     const debitNotes = await DebitNote.find()
//       .populate({
//         path: 'purchase',
//         select: 'referenceNumber supplier status purchaseDate',
//       })
//       .populate({
//         path: 'products.product',
//         select: 'name sku stock quantity image',
//       })
//       .sort({ createdAt: -1 });

//     res.status(200).json(debitNotes);
//   } catch (error) {
//     console.error("Error fetching debit notes:", error);
//     res.status(500).json({ message: 'Failed to fetch debit notes', error });
//   }
// };


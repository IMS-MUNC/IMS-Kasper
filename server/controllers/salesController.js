

// Auto-generate next sale reference number (like purchase)

// const Sales = require('../models/salesModel');
// const mongoose = require('mongoose');
// const Products = require('../models/productModels');

const mongoose = require("mongoose");
const Sales = require("../models/salesModel");
const Product = require("../models/productModels");
const StockHistory = require("../models/soldStockHistoryModel");
const PaymentHistory = require("../models/salesPaymentHistoryModel"); // ✅ New Model
const Invoice = require("../models/invoiceModel");

// Get Sale Stock History
exports.getStockHistory = async (req, res) => {
  try {
    const history = await require('../models/soldStockHistoryModel').find({})
      .populate({ path: 'product', select: 'productName name' })
      .sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Sale Payment History
exports.getPaymentHistory = async (req, res) => {
  try {
    const history = await require('../models/salesPaymentHistoryModel').find({})
      .populate({ path: 'customer', select: 'name' })
      .sort({ transactionDate: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Create Sale
// exports.createSale = async (req, res) => {
//   try {
//     const {
//       customer,
//       billing,
//       shipping,
//       products,
//       saleDate,
//       status,
//       paymentType, // Full | Partial | Pending
//       referenceNumber,
//       paidAmount,
//       dueAmount,
//       dueDate,
//       paymentMethod,
//       transactionId,
//       onlineMod,
//       transactionDate,
//       paymentStatus,
//       images,
//       description,
//       cgst,
//       sgst,
//       totalAmount,
//       labourCost,
//       orderTax,
//       orderDiscount,
//       roundOff,
//       roundOffValue,
//       shippingCost,
//       notes,
//       currency,
//       enableTax,
//       enableAddCharges,
//     } = req.body;

//     // ✅ Validate
//     if (!customer || !mongoose.Types.ObjectId.isValid(customer)) {
//       return res.status(400).json({ message: "Please fill customer" });
//     }
//     if (!products || products.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "Please add at least one product" });
//     }

//     // ✅ Check and update product stock
//     for (const item of products) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res.status(404).json({ message: "Product not found" });
//       }

//       if (product.availableQty < item.saleQty) {
//         return res.status(400).json({
//           message: `Not enough stock for ${product.name}. Available: ${product.availableQty}, Requested: ${item.saleQty}`,
//         });
//       }

//       // 🔹 Subtract saleQty from stock
//       product.availableQty -= item.saleQty;
//       await product.save();

//       // 🔹 Stock History Entry
//       await StockHistory.create({
//         product: product._id,
//         type: "SALE",
//         quantity: -item.saleQty,
//         reference: referenceNumber,
//         date: saleDate,
//         notes: `Sale created for ${item.saleQty} qty`,
//       });
//     }

//     // ✅ Create Sale
//     const sale = new Sales({
//       customer,
//       billing,
//       shipping,
//       products,
//       saleDate,
//       status,
//       paymentType,
//       referenceNumber,
//       paidAmount,
//       dueAmount,
//       dueDate,
//       paymentMethod,
//       transactionId,
//       onlineMod,
//       transactionDate,
//       paymentStatus,
//       images,
//       description,
//       cgst,
//       sgst,
//       totalAmount,
//       labourCost,
//       orderTax,
//       orderDiscount,
//       roundOff,
//       roundOffValue,
//       shippingCost,
//       notes,
//       currency,
//       enableTax,
//       enableAddCharges,
//     });

//     await sale.save();

//     // ✅ Payment History Log
//     if (paymentType === "Full" || paymentType === "Partial") {
//       await PaymentHistory.create({
//         sale: sale._id,
//         customer,
//         paymentType,
//         paidAmount,
//         dueAmount,
//         paymentMethod,
//         transactionId,
//         onlineMod,
//         transactionDate,
//         paymentStatus,
//         notes: "Initial payment logged during Sale creation",
//       });
//     }

//     res.status(201).json({ message: "Sale created successfully", sale });
//   } catch (error) {
//     console.error("Error creating sale:", error);

//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// 🔹 Add Payment to Existing Sale (Partial Payment Update)

exports.addPaymentToSale = async (req, res) => {
  try {
    const { saleId } = req.params;
    const { paidAmount, paymentMethod, transactionId, onlineMod, transactionDate, notes } = req.body;

    const sale = await Sales.findById(saleId);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    // ✅ Update Paid and Due Amount
    sale.paidAmount += paidAmount;
    sale.dueAmount = sale.totalAmount - sale.paidAmount;

    // ✅ Update Payment Status
    if (sale.dueAmount === 0) {
      sale.paymentStatus = "Paid";
      sale.paymentType = "Full";
    } else {
      sale.paymentStatus = "Partial";
      sale.paymentType = "Partial";
    }

    await sale.save();

    // ✅ Log into Payment History
    await PaymentHistory.create({
      sale: sale._id,
      customer: sale.customer,
      paymentType: sale.paymentType,
      paidAmount,
      dueAmount: sale.dueAmount,
      paymentMethod,
      transactionId,
      onlineMod,
      transactionDate,
      status: sale.paymentStatus,
      notes: notes || "Partial payment received",
    });

    res
      .status(200)
      .json({ message: "Payment added successfully", sale });
  } catch (error) {
    console.error("Error adding payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getNextReferenceNumber = async (req, res) => {
  try {
    const lastSale = await Sales.findOne({}, { referenceNumber: 1 }).sort({ _id: -1 });
    let newRef = "SL001"; // Default reference number
    if (lastSale && lastSale.referenceNumber) {
      const match = lastSale.referenceNumber.match(/SL(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10) + 1;
        newRef = `SL${num.toString().padStart(3, "0")}`;
      }
    }
    res.status(200).json({ referenceNumber: newRef });
  } catch (error) {
    console.error("Error generating sale reference number:", error);
    res.status(500).json({ error: "Failed to generate sale reference number" });
  }
};
// 🔹 Create Sale
exports.createSale = async (req, res) => {
  try {
    const {
      customer,
      billing,
      shipping,
      products,
      saleDate,
      status,
      paymentType,
      referenceNumber,
      paidAmount,
      dueAmount,
      dueDate,
      paymentMethod,
      transactionId,
      onlineMod,
      transactionDate,
      paymentStatus,
      images,
      description,
      cgst,
      sgst,
      totalAmount,
      labourCost,
      orderTax,
      orderDiscount,
      roundOff,
      roundOffValue,
      shippingCost,
      notes,
      currency,
      enableTax,
      enableAddCharges,
      grandTotal,
      company, // <-- Accept company ObjectId from frontend
    } = req.body;


    // ✅ Validate
    if (!customer || !mongoose.Types.ObjectId.isValid(customer)) {
      return res.status(400).json({ message: "Please fill customer" });
    }
    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Please add at least one product" });
    }

    // ✅ Check and update product stock
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.availableQty < item.saleQty) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available: ${product.availableQty}, Requested: ${item.saleQty}`,
        });
      }

      // 🔹 Subtract saleQty from stock and push soldPrice/soldQuantity
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { availableQty: -item.saleQty },
        $push: {
          soldPrice: item.sellingPrice,
          soldQuantity: item.saleQty,
        },
      });

      // 🔹 Stock History Entry
      await StockHistory.create({
        product: product._id,
        type: "SALE",
        soldQuantity: -item.saleQty,
        referenceNumber: referenceNumber,
        sellingPrice: item.sellingPrice,
        date: saleDate,
        notes: `Sale created for ${item.saleQty} qty`,
      });
    }



    // ✅ Generate next invoiceId
    let invoiceId = "INV001";
    // Find last invoice by createdAt, not _id, to avoid duplicate key error
    const lastInvoice = await Sales.findOne({ invoiceId: { $exists: true, $ne: null } }, { invoiceId: 1 }).sort({ createdAt: -1 });
    if (lastInvoice && lastInvoice.invoiceId) {
      const match = lastInvoice.invoiceId.match(/INV(\d+)/);
      if (match) {
        let num = parseInt(match[1], 10);
        // Check for existing invoiceId in DB and increment until unique
        let nextId;
        do {
          num++;
          nextId = `INV${num.toString().padStart(3, "0")}`;
        } while (await Sales.exists({ invoiceId: nextId }));
        invoiceId = nextId;
      }
    }

    // ✅ Create Sale with invoiceId
    const sale = new Sales({
      customer,
      billing,
      shipping,
      products,
      saleDate,
      status,
      paymentType,
      referenceNumber,
      paidAmount,
      dueAmount,
      dueDate,
      paymentMethod,
      transactionId,
      onlineMod,
      transactionDate,
      paymentStatus,
      images,
      description,
      cgst,
      sgst,
      totalAmount,
      labourCost,
      orderTax,
      orderDiscount,
      roundOff,
      roundOffValue,
      shippingCost,
      notes,
      currency,
      enableTax,
      enableAddCharges,
      grandTotal,
      invoiceId,
    });

    await sale.save();
    // ✅ Payment History Log
    if (paymentType === "Full" || paymentType === "Partial") {
      await PaymentHistory.create({
        sale: sale._id,
        customer,
        paymentType,
        paidAmount,
        dueAmount,
        paymentMethod,
        transactionId,
        onlineMod,
        transactionDate,
        paymentStatus,
        notes: "Initial payment logged during Sale creation",
      });
    }
    // ✅ Create Invoice entry
    try {
      await Invoice.create({
        sale: sale._id,
        customer,
        company: company || null, // <-- Set company ObjectId if provided
        products,
        billing,
        shipping,
        invoiceId,
        saleDate,
        dueDate,
        totalAmount,
        paidAmount,
        dueAmount,
        paymentType,
        paymentStatus,
        paymentMethod,
        transactionId,
        transactionDate,
        onlineMod,
        cgst,
        sgst,
        orderTax,
        orderDiscount,
        roundOff,
        roundOffValue,
        shippingCost,
        notes,
        description,
        images,
        grandTotal,
      });
    } catch (err) {
      console.error("Error creating invoice entry:", err);
    }
    // Fetch updated stock for all products in the sale
    const updatedStocks = await Promise.all(
      products.map(async item => {
        const product = await Product.findById(item.productId).select('_id name availableQty');
        return product;
      })
    );
    res.status(201).json({ message: "Sale created successfully", sale, updatedStocks, grandTotal });
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// Get all sales



exports.getSales = async (req, res) => {
  try {
    // Pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Search params
    const search = req.query.search || "";
    const status = req.query.status;
    const paymentStatus = req.query.paymentStatus;
    const customer = req.query.customer;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const invoiceId = req.query.invoiceId;

    // Build query
    let query = {};
    if (invoiceId) {
      query.invoiceId = invoiceId;
    } else {
      if (search) {
        query.$or = [
          { referenceNumber: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { notes: { $regex: search, $options: "i" } }
        ];
      }
      if (status) query.status = status;
      if (paymentStatus) query.paymentStatus = paymentStatus;
      if (customer) query.customer = customer;
      if (startDate && endDate) {
        query.saleDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
      }
    }

    // Fetch sales with pagination and search
    const total = await Sales.countDocuments(query);
    const salesRaw = await Sales.find(query)
      .populate({ path: 'customer', select: '-password -__v' })
      .populate({ path: 'products.productId', select: 'productName images' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Map productName and productImage for each product in each sale, and calculate payment fields
    const sales = salesRaw.map(sale => {
      const products = sale.products.map(p => ({
        ...p.toObject(),
        productName: p.productId?.productName || '',
        productImage: p.productId?.images?.[0]?.url || ''
      }));
      // Payment and calculation logic
      let subTotal = 0;
      let discountTotal = 0;
      let taxTotal = 0;
      let additionalCharges = (sale.shippingCost || 0) + (sale.labourCost || 0);
      let cgstValue = 0;
      let sgstValue = 0;
      if (products && products.length > 0) {
        products.forEach((p) => {
          const price = p.sellingPrice || 0;
          const qty = p.saleQty || 1;
          let discount = 0;
          // Check if discount is percent
          if (p.isDiscountPercent) {
            discount = ((price * qty) * (p.discount || 0)) / 100;
          } else {
            discount = p.discount || 0;
          }
          let afterDiscount = (price * qty) - discount;
          subTotal += price * qty;
          discountTotal += discount;
          // Tax calculation (CGST/SGST)
          if (sale.cgst && sale.sgst) {
            const cgst = parseFloat(sale.cgst) || 0;
            const sgst = parseFloat(sale.sgst) || 0;
            cgstValue += (afterDiscount * cgst) / 100;
            sgstValue += (afterDiscount * sgst) / 100;
          } else {
            taxTotal += (afterDiscount * (p.tax || 0)) / 100;
          }
        });
      }
      // Summary discount calculation
      let summaryDiscount = 0;
      // Only percent-based summaryDiscount is used now
      // Grand total
      let grandTotal = subTotal + cgstValue + sgstValue + taxTotal + additionalCharges - summaryDiscount;
      if (sale.orderDiscount) {
        const percent = parseFloat(sale.orderDiscount);
        summaryDiscount = ((subTotal + additionalCharges) * percent) / 100;
      }
      let roundOffValue = 0;
      if (sale.roundOff) {
        const rounded = Math.round(grandTotal);
        roundOffValue = rounded - grandTotal;
        grandTotal = rounded;
      }
      // Paid and due amount
      let paidAmount = sale.paidAmount || 0;
      let dueAmount = grandTotal - paidAmount;
      return {
        ...sale.toObject(),
        products,
        subTotal,
        discountTotal,
        summaryDiscount,
        cgstValue,
        sgstValue,
        taxTotal,
        additionalCharges,
        grandTotal,
        roundOffValue,
        paidAmount,
        dueAmount
      };
    });

    res.json({
      sales,
      total,
      page,

      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get sale by ID
exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sales.findById(req.params.id)
      .populate({ path: 'products.productId', select: 'productName images' });
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    // Optionally, map productName and image to top-level for each product
    const products = sale.products.map(p => ({
      ...p.toObject(),
      productName: p.productId?.productName || '',
      productImage: p.productId?.images?.[0]?.url || ''
    }));
    res.json({ ...sale.toObject(), products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update sale
exports.updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    let sale = await Sales.findById(id);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }
    // If request is to generate invoice and invoiceId is missing
    if (updateData.generateInvoice && !sale.invoiceId) {
      let invoiceId = "INV001";
      // Find last invoice by createdAt, not _id, to avoid duplicate key error
      const lastInvoice = await Sales.findOne({ invoiceId: { $exists: true, $ne: null } }, { invoiceId: 1 }).sort({ createdAt: -1 });
      if (lastInvoice && lastInvoice.invoiceId) {
        const match = lastInvoice.invoiceId.match(/INV(\d+)/);
        if (match) {
          let num = parseInt(match[1], 10);
          // Check for existing invoiceId in DB and increment until unique
          let nextId;
          do {
            num++;
            nextId = `INV${num.toString().padStart(3, "0")}`;
          } while (await Sales.exists({ invoiceId: nextId }));
          invoiceId = nextId;
        }
      }
      sale.invoiceId = invoiceId;
      await sale.save();
    } else {
      sale = await Sales.findByIdAndUpdate(id, updateData, { new: true });
    }
    res.status(200).json({ message: "Sale updated successfully", sale });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete sale
exports.deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sales.findByIdAndDelete(id);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }
    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all invoices or fetch by invoiceId
exports.getAllInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.query;
    let query = {};
    if (invoiceId) {
      query.invoiceId = invoiceId;
    } else {
      query.invoiceId = { $exists: true, $ne: null };
    }
    const invoices = await Sales.find(query)
      .populate({ path: 'customer', select: '-password -__v' })
      .populate({ path: 'products.productId', select: 'productName' })
      .sort({ createdAt: -1 });
    res.json({ invoices });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get all invoices or fetch by invoiceId
exports.getAllInvoice = async (req, res) => {
  try {
    // Pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Search and filter params
    const search = req.query.search || "";
    const customer = req.query.customer;
    const invoiceId = req.query.invoiceId;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    // Build query
    let query = { invoiceId: { $exists: true, $ne: null } };
    if (invoiceId) {
      query.invoiceId = invoiceId;
    }
    if (customer) {
      query.customer = customer;
    }
    if (startDate && endDate) {
      query.saleDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (search) {
      query.$or = [
        { invoiceId: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } }
      ];
    }

    // Count total
    const total = await Sales.countDocuments(query);
    // Fetch invoices with pagination and search
    const invoices = await Sales.find(query)
      .populate({ path: 'customer', select: '-password -__v name' })
      .populate({ path: 'products.productId', select: 'productName' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ invoices, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Sale Return API
exports.saleReturn = async (req, res) => {
  try {
    const { saleId, products, reason, returnDate } = req.body;
    const sale = await Sales.findById(saleId);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }
    // Update product stock for returned items
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) continue;
      product.availableQty += item.returnQty;
      await product.save();
      // Log stock history
      await StockHistory.create({
        product: product._id,
        type: "SALE_RETURN",
        soldQuantity: item.returnQty,
        referenceNumber: sale.referenceNumber,
        sellingPrice: item.sellingPrice,
        date: returnDate || new Date(),
        notes: `Sale return for ${item.returnQty} qty`,
      });
    }
    // Optionally log return in sale document
    sale.returns = sale.returns || [];
    sale.returns.push({ products, reason, returnDate: returnDate || new Date() });
    await sale.save();
    res.status(200).json({ message: "Sale return processed", sale });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Credit Return API
exports.creditReturn = async (req, res) => {
  try {
    const { saleId, amount, reason, returnDate } = req.body;
    const sale = await Sales.findById(saleId);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }
    // Update paid and due amounts
    sale.paidAmount -= amount;
    sale.dueAmount += amount;
    // Optionally log credit return
    sale.creditReturns = sale.creditReturns || [];
    sale.creditReturns.push({ amount, reason, returnDate: returnDate || new Date() });
    await sale.save();
    // Log payment history
    await PaymentHistory.create({
      sale: sale._id,
      customer: sale.customer,
      paymentType: "Credit Return",
      paidAmount: -amount,
      dueAmount: sale.dueAmount,
      paymentMethod: "Credit Return",
      transactionDate: returnDate || new Date(),
      status: "Credit Returned",
      notes: reason || "Credit returned to customer",
    });
    res.status(200).json({ message: "Credit return processed", sale });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

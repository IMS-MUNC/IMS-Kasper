
const mongoose = require("mongoose");
const Invoice = require("../models/invoiceModel");
const Sales = require("../models/salesModel");
const Customer = require("../models/customerModel")


// Print invoice from getSales
const PDFDocument = require('pdfkit');
const { Readable } = require('stream');

exports.printSalesInvoice = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        const sale = await Sales.findOne({ invoiceId })
            .populate({ path: 'customer', select: 'name address phone email' })
            .populate({ path: 'products.productId', select: 'productName hsnCode images' });
        if (!sale) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        // Prepare invoice data for print (table design)
        const invoiceData = {
            invoiceId: sale.invoiceId,
            saleDate: sale.saleDate,
            customer: sale.customer,
            products: sale.products.map(p => ({
                productName: p.productId?.productName || '',
                hsnCode: p.productId?.hsnCode || '',
                qty: p.saleQty,
                price: p.sellingPrice,
                discount: p.discount || 0,
                total: (p.sellingPrice * p.saleQty) - (p.discount || 0),
                BV: p.BV || '',
            })),
            subTotal: sale.subTotal,
            cgst: sale.cgst,
            sgst: sale.sgst,
            grandTotal: sale.grandTotal,
            paidAmount: sale.paidAmount,
            dueAmount: sale.dueAmount,
            paymentMethod: sale.paymentMethod,
            notes: sale.notes,
        };
        res.json({ invoice: invoiceData });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Download invoice PDF from getSales
exports.downloadSalesInvoicePDF = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        const sale = await Sales.findOne({ invoiceId })
            .populate({ path: 'customer', select: 'name address phone email' })
            .populate({ path: 'products.productId', select: 'productName hsnCode images' });
        if (!sale) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        // PDF generation
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=Invoice_${sale.invoiceId}.pdf`);
            res.send(pdfData);
        });
        // Header
        doc.fontSize(18).text(`Invoice: ${sale.invoiceId}`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Date: ${sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : ''}`);
        doc.text(`Customer: ${sale.customer?.name || ''}`);
        doc.text(`Phone: ${sale.customer?.phone || ''}`);
        doc.text(`Email: ${sale.customer?.email || ''}`);
        doc.text(`Address: ${sale.customer?.address || ''}`);
        doc.moveDown();
        // Table header
        doc.fontSize(12).text('Product', 30, doc.y, { continued: true });
        doc.text('HSN', 120, doc.y, { continued: true });
        doc.text('Qty', 180, doc.y, { continued: true });
        doc.text('Price', 220, doc.y, { continued: true });
        doc.text('Discount', 270, doc.y, { continued: true });
        doc.text('Total', 330, doc.y, { continued: true });
        doc.text('BV', 400, doc.y);
        doc.moveDown();
        // Table rows
        sale.products.forEach(p => {
            doc.text(p.productId?.productName || '', 30, doc.y, { continued: true });
            doc.text(p.productId?.hsnCode || '', 120, doc.y, { continued: true });
            doc.text(p.saleQty || '', 180, doc.y, { continued: true });
            doc.text(p.sellingPrice || '', 220, doc.y, { continued: true });
            doc.text(p.discount || 0, 270, doc.y, { continued: true });
            doc.text((p.sellingPrice * p.saleQty) - (p.discount || 0), 330, doc.y, { continued: true });
            doc.text(p.BV || '', 400, doc.y);
        });
        doc.moveDown();
        // Totals
        doc.text(`SubTotal: ${sale.subTotal || ''}`);
        doc.text(`CGST: ${sale.cgst || ''}`);
        doc.text(`SGST: ${sale.sgst || ''}`);
        doc.text(`Grand Total: ${sale.grandTotal || ''}`);
        doc.text(`Paid Amount: ${sale.paidAmount || ''}`);
        doc.text(`Due Amount: ${sale.dueAmount || ''}`);
        doc.text(`Payment Method: ${sale.paymentMethod || ''}`);
        doc.text(`Notes: ${sale.notes || ''}`);
        doc.end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create Invoice
exports.createInvoice = async (req, res) => {
    try {
        const invoiceData = req.body;
        const invoice = new Invoice(invoiceData);
        await invoice.save();
        res.status(201).json({ message: "Invoice created successfully", invoice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get all invoices or fetch by invoiceId (same as salesController logic, but from Invoice model)
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

        // Get all invoiceIds from Sales model
        const salesInvoiceIds = await Sales.find({ invoiceId: { $exists: true, $ne: null } }).distinct("invoiceId");
        // console.log("Invoice IDs from Sales model:", salesInvoiceIds);

        // Build query to only fetch invoices whose invoiceId exists in Sales
        let query = { invoiceId: { $in: salesInvoiceIds } };
        if (invoiceId) {
            query.invoiceId = invoiceId;
        }
        if (customer) {
            query.customer = customer;
        }
        if (startDate && endDate) {
            query.saleDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        // if (search) {
        //     query.$or = [
        //         { invoiceId: { $regex: search, $options: "i" } },
        //         { description: { $regex: search, $options: "i" } },
        //         { notes: { $regex: search, $options: "i" } }
        //     ];
        // }
        if (search) {
            // Find customer IDs that match the search term
            const matchingCustomers = await Customer.find({
                name: { $regex: search, $options: "i" }, // ✅ fixed
            }).distinct("_id");

            // Find matching sales by referenceNumber (Sale No)
            const matchingSales = await Sales.find({
                referenceNumber: { $regex: search, $options: "i" }, // ✅ fixed
            }).distinct("invoiceId");

            query.$or = [
                { invoiceId: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { notes: { $regex: search, $options: "i" } },
                { customer: { $in: matchingCustomers } },
                { invoiceId: { $in: matchingSales } },
            ];
        }


        // Count total
        const total = await Invoice.countDocuments(query);
        // Fetch invoices with pagination and search
        let invoices = [];
        try {
            invoices = await Invoice.find(query)
                .populate({ path: 'customer', select: 'name billingAddress email phone __v', options: { strictPopulate: false } })
                .populate({ path: 'company', select: 'companyName address email phone', model: 'CompanySetting', options: { strictPopulate: false } })
                .populate({ path: 'products.productId', select: 'productName', options: { strictPopulate: false } })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
        } catch (popErr) {
            // console.error('Invoice population error:', popErr);
            return res.status(500).json({ message: 'Invoice population error', error: popErr.message });
        }

        // For each invoice, fetch matching sale data and calculate totals
        const merged = await Promise.all(
            invoices.map(async (inv) => {
                let sale = null;
                try {
                    sale = await Sales.findOne({ invoiceId: inv.invoiceId });
                } catch (e) {
                    sale = null;
                }
                // Calculate totals
                let subTotal = 0;
                let discountTotal = 0;
                let taxTotal = 0;
                let additionalCharges = inv.shippingCost || 0;
                let cgstValue = 0;
                let sgstValue = 0;
                // Calculate per product
                if (inv.products && inv.products.length > 0) {
                    inv.products.forEach((p) => {
                        const price = p.sellingPrice || 0;
                        const qty = p.saleQty || 1;
                        let discount = p.discount || 0;
                        let afterDiscount = (price * qty) - discount;
                        subTotal += price * qty;
                        discountTotal += discount;
                        // Tax calculation (CGST/SGST)
                        if (inv.cgst && inv.sgst) {
                            const cgst = parseFloat(inv.cgst) || 0;
                            const sgst = parseFloat(inv.sgst) || 0;
                            cgstValue += (afterDiscount * cgst) / 100;
                            sgstValue += (afterDiscount * sgst) / 100;
                        } else {
                            taxTotal += (afterDiscount * (p.tax || 0)) / 100;
                        }
                    });
                }
                // Grand total
                let grandTotal = subTotal - discountTotal + cgstValue + sgstValue + taxTotal + additionalCharges;
                // Apply orderDiscount if present
                if (inv.orderDiscount) {
                    grandTotal -= parseFloat(inv.orderDiscount) || 0;
                }
                // Round off if enabled
                let roundOffValue = 0;
                if (inv.roundOff) {
                    const rounded = Math.round(grandTotal);
                    roundOffValue = rounded - grandTotal;
                    grandTotal = rounded;
                }
                // For 'From', use company address (handle missing company)
                const fromAddress = inv.company && inv.company.address ? inv.company.address : '';
                // For 'To', use customer billing address (handle missing customer)
                const toAddress = inv.customer && inv.customer.billingAddress ? inv.customer.billingAddress : '';
                return {
                    invoice: {
                        ...inv.toObject(),
                        fromAddress,
                        toAddress,
                        subTotal,
                        discountTotal,
                        cgstValue,
                        sgstValue,
                        taxTotal,
                        additionalCharges,
                        grandTotal,
                        roundOffValue
                    },
                    sale: sale
                };
            })
        );

        res.json({ invoices: merged, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        // Improved error logging for debugging
        console.error('getAllInvoice error:', err && err.stack ? err.stack : err);
        // Include stack in response during development to aid debugging (remove in prod)
        const safeMessage = err && err.message ? err.message : 'Internal Server Error';
        return res.status(500).json({ message: safeMessage, error: err && err.stack ? String(err.stack) : String(err) });
    }
};
// Get all invoices (with search, pagination, filter)
exports.getAllInvoices = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || "";
        const customer = req.query.customer;
        const invoiceId = req.query.invoiceId;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        let query = { invoiceId: { $exists: true, $ne: null } };
        if (invoiceId) query.invoiceId = invoiceId;
        if (customer) query.customer = customer;
        if (startDate && endDate) query.saleDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
        if (search) {
            query.$or = [
                { invoiceId: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { notes: { $regex: search, $options: "i" } }
            ];
        }
        const total = await Invoice.countDocuments(query);
        const invoices = await Invoice.find(query)
            .populate({ path: "customer", select: "name" })
            .populate({ path: "company", select: "companyName address email phone", model: "CompanySetting" })
            .populate({ path: "products.productId", select: "productName" })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.json({ invoices, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get invoice by ID
exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate({ path: "customer", select: "-password -__v name billingAddress email phone" })
            .populate({ path: "company", select: "companyName address email phone", model: "CompanySetting" })
            .populate({ path: "products.productId", select: "productName" });
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update invoice
exports.updateInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });
        res.json({ message: "Invoice updated successfully", invoice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete invoice
exports.deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });
        res.json({ message: "Invoice deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.bulkDeleteInvoice = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) {
            return res
                .status(400)
                .json({ message: "Invalid or missing 'ids', array in request body" });
        }
        const result = await Invoice.deleteMany({ _id: { $in: ids } });
        return res.status(200).json({
            message: `${result.deletedCount} invoices deleted successfully`,
            deletedCount: result.deletedCount,
        })
    } catch (error) {
        res
            .status(500)
            .json({ message: "Bulk delete failed", error: error.message });
    }
};

const mongoose = require('mongoose');
const PosSale = require('../models/posSaleModel');
const Product = require('../models/productModels');
const Customer = require('../models/customerModel');

// Create new POS sale
const createPosSale = async (req, res) => {
  try {
    // console.log('=== POS SALE REQUEST START ===');
    // console.log('Received POS sale request:', req.body);
    // console.log('Request headers:', req.headers);
    // console.log('User from middleware:', req.user);
    // console.log('Request method:', req.method);
    // console.log('Request URL:', req.url);
    // console.log('Request body type:', typeof req.body);
    // console.log('Request body keys:', Object.keys(req.body));
    // console.log('Items array length:', req.body.items ? req.body.items.length : 'No items');
    // console.log('Customer ID:', req.body.customerId);
    // console.log('Payment method:', req.body.paymentMethod);

    const {
      customerId,
      items,
      paymentMethod,
      amountReceived,
      changeReturned,
      bagCharge,
      subtotal,
      discount,
      tax,
      totalAmount
    } = req.body;

    // Validate required fields
    if (!customerId || !items || items.length === 0 || !paymentMethod) {
      return res.status(400).json({
        message: 'Missing required fields',
        details: {
          customerId: !customerId ? 'Customer ID is required' : 'OK',
          items: !items || items.length === 0 ? 'At least one item is required' : 'OK',
          paymentMethod: !paymentMethod ? 'Payment method is required' : 'OK'
        }
      });
    }

    // Validate customerId format
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: 'Invalid customer ID format' });
    }

    // Get customer details
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Validate items structure
    for (const item of items) {
      if (!item.productId || !mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({ message: 'Invalid product ID in items' });
      }
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({ message: 'Invalid quantity in items' });
      }
    }

    // Prepare items with product details
    const saleItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      // Check if enough stock is available
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.productName}. Available: ${product.quantity}`
        });
      }

      // Reduce product quantity
      try {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: -item.quantity }
        });
      } catch (error) {
        console.error('Error updating product quantity:', error);
        return res.status(500).json({ message: 'Error updating product quantity' });
      }

      saleItems.push({
        productId: item.productId,
        productName: product.productName,
        quantity: item.quantity,
        unitPrice: item.sellingPrice,
        totalPrice: item.totalPrice,
        discount: item.discountValue || 0,
        discountType: item.discountType || 'Fixed',
        tax: item.tax || 0,
        unit: product.unit || 'pcs',
        images: product.images && Array.isArray(product.images) ? product.images.map(img => typeof img === 'string' ? img : (img.url || '')) : []
      });
    }

    // Validate payment method
    if (!paymentMethod || !['Cash', 'Card', 'UPI'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    // Validate totals data
    if (typeof subtotal !== 'number' || subtotal < 0) {
      return res.status(400).json({ message: 'Invalid subtotal value' });
    }
    if (typeof totalAmount !== 'number' || totalAmount < 0) {
      return res.status(400).json({ message: 'Invalid total amount value' });
    }

    // Ensure all numeric values are numbers
    const numericFields = {
      subtotal: Number(subtotal),
      discount: Number(discount || 0),
      tax: Number(tax || 0),
      bagCharge: Number(bagCharge || 0),
      totalAmount: Number(totalAmount)
    };

    // Validate numeric conversion
    for (const [field, value] of Object.entries(numericFields)) {
      if (isNaN(value)) {
        return res.status(400).json({ message: `Invalid ${field} value: not a number` });
      }
    }

    console.log('Numeric fields validation passed:', numericFields);

    // Calculate due amount
    const dueAmount = Math.max(0, numericFields.totalAmount - (amountReceived || 0));
    const saleStatus = dueAmount > 0 ? 'Due' : 'Paid';

    // Create sale record
    const saleData = {
      customer: {
        customerId: customer._id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email
      },
      items: saleItems,
      paymentDetails: {
        paymentMethod,
        amountReceived: amountReceived || 0,
        changeReturned: changeReturned || 0,
        bagCharge: bagCharge || 0,
        dueAmount: dueAmount
      },
      totals: {
        subtotal: numericFields.subtotal,
        discount: numericFields.discount,
        tax: numericFields.tax,
        bagCharge: numericFields.bagCharge,
        totalAmount: numericFields.totalAmount
      },
      saleDate: new Date(),
      status: saleStatus,
      createdBy: req.user && req.user._id ? req.user._id : null
    };

    console.log('Creating POS sale with data:', JSON.stringify(saleData, null, 2));
    console.log('User info:', req.user ? { _id: req.user._id, name: req.user.name } : 'No user');

    // Remove any undefined values that might cause save issues
    Object.keys(saleData).forEach(key => {
      if (saleData[key] === undefined) {
        delete saleData[key];
      }
    });

    // Validate required fields are present
    const requiredFields = ['customer', 'items', 'paymentDetails', 'totals'];
    for (const field of requiredFields) {
      if (!saleData[field]) {
        console.error(`Missing required field: ${field}`);
        return res.status(400).json({
          message: `Missing required field: ${field}`,
          details: `Field ${field} is required but not provided`
        });
      }
    }

    console.log('Final sale data after validation:', JSON.stringify(saleData, null, 2));

    // Generate invoice number directly in controller
    try {
      const count = await PosSale.countDocuments();
      const invoiceNumber = `INV${Date.now()}${count + 1}`;
      console.log('Generated invoice number in controller:', invoiceNumber);

      // Add invoice number to sale data
      saleData.invoiceNumber = invoiceNumber;
    } catch (error) {
      console.error('Error generating invoice number in controller:', error);
      // Fallback invoice number
      saleData.invoiceNumber = `INV${Date.now()}`;
    }

    let posSale;
    try {
      console.log('Creating PosSale with data:', JSON.stringify(saleData, null, 2));
      posSale = new PosSale(saleData);
      console.log('PosSale model created successfully');
      console.log('PosSale model after creation:', {
        _id: posSale._id,
        isNew: posSale.isNew,
        invoiceNumber: posSale.invoiceNumber,
        invoiceNumberType: typeof posSale.invoiceNumber
      });
    } catch (modelError) {
      console.error('Error creating PosSale model:', modelError);
      return res.status(500).json({
        message: 'Error creating sale model',
        error: modelError.message,
        details: 'Failed to create PosSale document instance'
      });
    }

    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      console.error('Database not connected. Ready state:', mongoose.connection.readyState);
      return res.status(500).json({
        message: 'Database connection error',
        details: 'Database is not ready'
      });
    }

    try {
      console.log('Attempting to save POS sale with data:', JSON.stringify(posSale, null, 2));
      console.log('POS sale object keys:', Object.keys(posSale));
      console.log('POS sale document:', posSale.toObject ? posSale.toObject() : posSale);
      console.log('Database ready state:', mongoose.connection.readyState);
      console.log('Document isNew before save:', posSale.isNew);
      console.log('Document _id before save:', posSale._id);

      // Check if the document is valid before saving
      const validationError = posSale.validateSync();
      if (validationError) {
        console.error('Validation error before save:', validationError);
        console.error('Validation error details:', validationError.errors);
        return res.status(400).json({
          message: 'Validation error',
          error: validationError.message,
          details: validationError.errors
        });
      }

      console.log('Document validation passed, proceeding with save...');
      const savedSale = await posSale.save();
      console.log('Sale saved successfully with ID:', savedSale._id);

      res.status(201).json({
        success: true,
        message: 'Sale recorded successfully',
        data: savedSale
      });
    } catch (saveError) {
      console.error('Error saving POS sale:', saveError);
      console.error('Save error details:', {
        name: saveError.name,
        message: saveError.message,
        code: saveError.code,
        errors: saveError.errors,
        stack: saveError.stack
      });

      // If save fails, try to restore product quantities
      try {
        for (const item of items) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { quantity: item.quantity }
          });
        }
      } catch (restoreError) {
        console.error('Error restoring product quantities:', restoreError);
      }

      return res.status(500).json({
        message: 'Error saving sale record',
        error: saveError.message,
        details: saveError.errors || saveError.message
      });
    }

  } catch (error) {
    // console.error('=== POS SALE REQUEST ERROR ===');
    // console.error('Error creating POS sale:', error);
    // console.error('Error stack:', error.stack);
    // console.error('Error name:', error.name);
    // console.error('Error message:', error.message);
    // console.error('=== END ERROR LOG ===');
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get all POS sales with pagination
const getPosSales = async (req, res) => {
  try {
    // One-time migration: Update any existing "Completed" status to "Paid"
    try {
      await PosSale.updateMany(
        { status: 'Completed' },
        { status: 'Paid' }
      );
    } catch (migrationError) {
      console.log('Migration completed or no records to update');
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.paymentMethod) filter['paymentDetails.paymentMethod'] = req.query.paymentMethod;
    if (req.query.customerId) filter['customer.customerId'] = req.query.customerId;
    if (req.query.startDate && req.query.endDate) {
      filter.saleDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    // Handle search functionality
    if (req.query.search && req.query.search.trim()) {
      const searchTerm = req.query.search.trim();
      const searchRegex = new RegExp(searchTerm, 'i');

      filter.$or = [
        { invoiceNumber: searchRegex },
        { 'customer.name': searchRegex },
        { 'customer.phone': searchRegex },
        { 'items.productName': searchRegex }
      ];
    }

    // Get total count
    const totalSales = await PosSale.countDocuments(filter);
    const totalPages = Math.ceil(totalSales / limit);

    // Get sales with pagination
    const sales = await PosSale.find(filter)
      .populate('customer.customerId', 'name phone email')
      .populate('items.productId', 'productName images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: sales,
      pagination: {
        currentPage: page,
        totalPages,
        totalSales,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching POS sales:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get single POS sale by ID
const getPosSaleById = async (req, res) => {
  try {
    const sale = await PosSale.findById(req.params.id)
      .populate('customer.customerId', 'name phone email address')
      .populate('items.productId', 'productName images category unit');

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.status(200).json({
      success: true,
      data: sale
    });

  } catch (error) {
    console.error('Error fetching POS sale:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get sales summary/statistics
const getSalesSummary = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const todaySales = await PosSale.find({
      saleDate: { $gte: startOfDay, $lte: endOfDay }
    });

    const totalSales = todaySales.length;
    const totalRevenue = todaySales.reduce((sum, sale) => sum + sale.totals.totalAmount, 0);
    const totalItems = todaySales.reduce((sum, sale) =>
      sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    res.status(200).json({
      success: true,
      data: {
        totalSales,
        totalRevenue,
        totalItems,
        averageOrderValue: totalSales > 0 ? totalRevenue / totalSales : 0
      }
    });

  } catch (error) {
    console.error('Error fetching sales summary:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  createPosSale,
  getPosSales,
  getPosSaleById,
  getSalesSummary
};
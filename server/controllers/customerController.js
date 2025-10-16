
const Customer = require('../models/customerModel');
const cloudinary = require('../utils/cloudinary/cloudinary');

// Create new customer
// exports.createCustomer = async (req, res) => {
//   try {
//     // Defensive parsing of ObjectId refs
//     const prepareRef = (field) => (typeof field === 'object' && field?.value) ? field.value : field;

//     // Fixing nested country/state/city structure
//     const data = {
//       ...req.body,
//       images: req.file ? [`/uploads/${req.file.filename}`] : [],
//       billing: {
//         ...req.body.billing,
//         country: prepareRef(req.body.billing?.country),
//         state: prepareRef(req.body.billing?.state),
//         city: prepareRef(req.body.billing?.city),
//       },
//       shipping: {
//         ...req.body.shipping,
//         country: prepareRef(req.body.shipping?.country),
//         state: prepareRef(req.body.shipping?.state),
//         city: prepareRef(req.body.shipping?.city),
//       },
//     };

//     const customer = new Customer(data);
//     await customer.save();

//     const populated = await Customer.findById(customer._id)
//       .populate('billing.country billing.state billing.city shipping.country shipping.state shipping.city');

//     res.status(201).json(populated);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };
// Create new customer
exports.createCustomer = async (req, res) => {
  try {
    // Parse JSON strings from req.body for nested objects
    let parsedBody = { ...req.body };
    if (req.body.billing && typeof req.body.billing === 'string') {
      parsedBody.billing = JSON.parse(req.body.billing);
    }
    if (req.body.shipping && typeof req.body.shipping === 'string') {
      parsedBody.shipping = JSON.parse(req.body.shipping);
    }
    if (req.body.bank && typeof req.body.bank === 'string') {
      parsedBody.bank = JSON.parse(req.body.bank);
    }

    const prepareRef = (field) => (typeof field === 'object' && field?.value) ? field.value : field;

    // 1️⃣ Upload images to Cloudinary
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      try {
        const uploadPromises = req.files.map(file =>
          cloudinary.uploader.upload(file.path, { folder: "customer_images" })
        );
        const uploaded = await Promise.all(uploadPromises);
        imageUrls = uploaded.map(img => img.secure_url);
      } catch (uploadErr) {
        console.error("Image upload failed:", uploadErr);
        // Proceed without images if upload fails
        imageUrls = [];
      }
    }

    // 2️⃣ Build customer data
    const data = {
      ...parsedBody,
      images: imageUrls,
      billing: {
        ...parsedBody.billing,
        country: prepareRef(parsedBody.billing?.country),
        // state: prepareRef(parsedBody.billing?.state),
         state: parsedBody.gstType === "Unregister" ? "N/A" : prepareRef(parsedBody.billing?.state),
        city: prepareRef(parsedBody.billing?.city),
      },
      shipping: {
        ...parsedBody.shipping,
        country: prepareRef(parsedBody.shipping?.country),
        // state: prepareRef(parsedBody.shipping?.state),
        state: parsedBody.gstType === "Unregister" ? "N/A" : prepareRef(parsedBody.shipping?.state),
        city: prepareRef(parsedBody.shipping?.city),
      },
    };

    const emailExists = await Customer.findOne({ email: data.email });
    if (emailExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const phoneExists = await Customer.findOne({ phone: data.phone });
    if (phoneExists) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }
    
    const customer = new Customer(data);
    await customer.save();

    const populated = await Customer.findById(customer._id)
      .populate('billing.country billing.state billing.city shipping.country shipping.state shipping.city');

    res.status(201).json(populated);
  } catch (err) {
    console.error("Create Customer Error:", err);
    res.status(400).json({ error: err.message });
  }
};

// Update customer
exports.updateCustomer = async (req, res) => {
  try {
    // Parse JSON strings from req.body for nested objects (similar to create)
    let parsedBody = { ...req.body };
    if (req.body.billing && typeof req.body.billing === 'string') {
      parsedBody.billing = JSON.parse(req.body.billing);
    }
    if (req.body.shipping && typeof req.body.shipping === 'string') {
      parsedBody.shipping = JSON.parse(req.body.shipping);
    }
    if (req.body.bank && typeof req.body.bank === 'string') {
      parsedBody.bank = JSON.parse(req.body.bank);
    }

    const prepareRef = (field) => (typeof field === 'object' && field?.value) ? field.value : field;

    const data = {
      ...parsedBody,
      billing: {
        ...parsedBody.billing,
        country: prepareRef(parsedBody.billing?.country),
        state: prepareRef(parsedBody.billing?.state),
        city: prepareRef(parsedBody.billing?.city),
      },
      shipping: {
        ...parsedBody.shipping,
        country: prepareRef(parsedBody.shipping?.country),
        state: prepareRef(parsedBody.shipping?.state),
        city: prepareRef(parsedBody.shipping?.city),
      },
    };

    const customer = await Customer.findByIdAndUpdate(req.params.id, data, { new: true });

    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const populated = await Customer.findById(customer._id)
      .populate('billing.country billing.state billing.city shipping.country shipping.state shipping.city');

    res.json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all active customers (status: true)
exports.getActiveCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ status: true })
      .populate('billing.country billing.state billing.city shipping.country shipping.state shipping.city'); // Removed invalid non-ref fields like 'name'
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .populate('billing.country billing.state billing.city shipping.country shipping.state shipping.city');
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('billing.country billing.state billing.city shipping.country shipping.state shipping.city');

    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get all active customers (status: true)
exports.getActiveCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ status: true })
      .populate('billing.country billing.state billing.city shipping.country shipping.state shipping.city name email phone currency website notes');
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Update customer
exports.updateCustomer = async (req, res) => {
  try {
    const prepareRef = (field) => (typeof field === 'object' && field?.value) ? field.value : field;

    const data = {
      ...req.body,
      billing: {
        ...req.body.billing,
        country: prepareRef(req.body.billing?.country),
        state: prepareRef(req.body.billing?.state),
        city: prepareRef(req.body.billing?.city),
      },
      shipping: {
        ...req.body.shipping,
        country: prepareRef(req.body.shipping?.country),
        state: prepareRef(req.body.shipping?.state),
        city: prepareRef(req.body.shipping?.city),
      },
    };

    const customer = await Customer.findByIdAndUpdate(req.params.id, data, { new: true });

    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const populated = await Customer.findById(customer._id)
      .populate('billing.country billing.state billing.city shipping.country shipping.state shipping.city');

    res.json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Upload customer image
exports.uploadCustomerImage = async (req, res) => {
  try {
    const customerId = req.params.id;
    if (!req.file) return res.status(400).json({ error: 'No image provided' });

    // Upload to Cloudinary
    const uploaded = await cloudinary.uploader.upload(req.file.path, { folder: "customer_images" });
    const imageUrl = uploaded.secure_url;

    // Find and update customer - replace images array with new image
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    customer.images = [imageUrl];
    await customer.save();

    res.json({ message: 'Image uploaded successfully', imageUrl });
  } catch (err) {
    console.error("Upload Image Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// const Customer = require('../models/customerModel');
// exports.createCustomer = async (req, res) => {
//   try {
//     const customer = new Customer(req.body);
//     await customer.save();
//     // Populate country, state, city after save
//     const populated = await Customer.findById(customer._id)
//       .populate('billing.country billing.state billing.city shipping.country shipping.state shipping.city');
//     res.status(201).json(populated);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// exports.getAllCustomers = async (req, res) => {
//   try {
//     const customers = await Customer.find()
//       .populate('billing.country billing.state billing.city shipping.country shipping.state shipping.city');
//     res.json(customers);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getCustomerById = async (req, res) => {
//   try {
//     const customer = await Customer.findById(req.params.id)
//       .populate('billing.country billing.state billing.city shipping.country shipping.state shipping.city');
//     if (!customer) return res.status(404).json({ error: 'Customer not found' });
//     res.json(customer);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.updateCustomer = async (req, res) => {
//   try {
//     const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!customer) return res.status(404).json({ error: 'Customer not found' });
//     const populated = await Customer.findById(customer._id)
//       .populate('billing.country billing.state billing.city shipping.country shipping.state shipping.city');
//     res.json(populated);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// exports.deleteCustomer = async (req, res) => {
//   try {
//     const customer = await Customer.findByIdAndDelete(req.params.id);
//     if (!customer) return res.status(404).json({ error: 'Customer not found' });
//     res.json({ message: 'Customer deleted' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

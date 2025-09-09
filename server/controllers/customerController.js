
const Customer = require('../models/customerModel');

// Create new customer
exports.createCustomer = async (req, res) => {
  try {
    // Defensive parsing of ObjectId refs
    const prepareRef = (field) => (typeof field === 'object' && field?.value) ? field.value : field;

    // Fixing nested country/state/city structure
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

    const customer = new Customer(data);
    await customer.save();

    const populated = await Customer.findById(customer._id)
      .populate('billing.country billing.state billing.city shipping.country shipping.state shipping.city');

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
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

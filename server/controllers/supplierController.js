const Supplier = require('../models/supplierModel');
const cloudinary = require("../utils/cloudinary/cloudinary");
const axios = require('axios');

// Create supplier
exports.createSupplier = async (req, res) => {
  try {
    let supplierData = req.body;

    // Parse nested fields if sent as string
    if (typeof supplierData.billing === 'string') {
      supplierData.billing = JSON.parse(supplierData.billing);
    }
    if (typeof supplierData.shipping === 'string') {
      supplierData.shipping = JSON.parse(supplierData.shipping);
    }
    if (typeof supplierData.bank === 'string') {
      supplierData.bank = JSON.parse(supplierData.bank);
    }

    // Auto-generate supplierCode
    const lastSupplier = await Supplier.findOne(
      { supplierCode: { $ne: null } },
      {},
      { sort: { createdAt: -1 } }
    ); 
    let supplierCode = 'SUP001';
    if (lastSupplier && lastSupplier.supplierCode) {
      const lastNum = parseInt(lastSupplier.supplierCode.replace('SUP', '')) || 0;
      supplierCode = 'SUP' + String(lastNum + 1).padStart(3, '0');
    }
    supplierData.supplierCode = supplierCode;

    // Cloudinary Image Upload (Single or Multiple Files)
    const uploadedImages = req.files?.length
      ? await Promise.all(
          req.files.map((file) =>
            cloudinary.uploader.upload(file.path, {
              folder: "suppliers",
            })
          )
        )
      : req.file
      ? [await cloudinary.uploader.upload(req.file.path, { folder: "suppliers" })]
      : [];

    supplierData.images = uploadedImages.map((img) => ({
      url: img.secure_url,
      public_id: img.public_id,
    }));

    const supplier = await Supplier.create(supplierData);
    res.status(201).json(supplier);
  } catch (err) {
    console.error('Create supplier error:', err);
    res.status(500).json({
      error: 'Failed to create supplier',
      details: err.message,
    });
  }
};

// Get all suppliers
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find()
      .populate('billing.country')
      .populate('billing.state')
      .populate('billing.city')
      .populate('shipping.country')
      .populate('shipping.state')
      .populate('shipping.city');
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch suppliers', details: err.message });
  }
};

// Get single supplier
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)
      .populate('billing.country')
      .populate('billing.state')
      .populate('billing.city')
      .populate('shipping.country')
      .populate('shipping.state')
      .populate('shipping.city');
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch supplier', details: err.message });
  }
};


// GET ACTIVE USERS
// Get only active suppliers for dropdown/modal
exports.getActiveSuppliers = async (req, res) => {
  try {
    // Only fetch suppliers with status: true, and only needed fields
    const activeSuppliers = await Supplier.find({ status: true })
      .populate('_id firstName lastName supplierCode companyName') // add more fields if needed
      .sort({ companyName: 1 }); // or sort as you wish

    res.status(200).json({
      message: "Active suppliers fetched successfully",
      total: activeSuppliers.length,
      suppliers: activeSuppliers,
    });
  } catch (error) {
    console.error("Get Active Suppliers Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update supplier
exports.updateSupplier = async (req, res) => {
  try {
    let updateData = req.body;
    if (typeof updateData.billing === 'string') {
      updateData.billing = JSON.parse(updateData.billing);
    }
    if (typeof updateData.shipping === 'string') {
      updateData.shipping = JSON.parse(updateData.shipping);
    }
    if (typeof updateData.bank === 'string') {
      updateData.bank = JSON.parse(updateData.bank);
    }

    // Cloudinary Image Upload (Single or Multiple Files)
    let uploadedImages = [];
    if (req.files?.length) {
      uploadedImages = await Promise.all(
        req.files.map((file) =>
          cloudinary.uploader.upload(file.path, {
            folder: "suppliers",
          })
        )
      );
    } else if (req.file) {
      uploadedImages = [await cloudinary.uploader.upload(req.file.path, { folder: "suppliers" })];
    }

    if (uploadedImages.length > 0) {
      updateData.images = uploadedImages.map((img) => ({
        url: img.secure_url,
        public_id: img.public_id,
      }));
    }

    const supplier = await Supplier.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('billing.country')
      .populate('billing.state')
      .populate('billing.city')
      .populate('shipping.country')
      .populate('shipping.state')
      .populate('shipping.city');
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update supplier', details: err.message });
  }
};

// Delete supplier
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ message: 'Supplier deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete supplier', details: err.message });
  }
};

// GSTIN verification (example, adjust to your API)
exports.verifyGSTIN = async (req, res) => {
  const { gstin } = req.body;
  try {
    // Basic GSTIN format check
    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin)) {
      return res.status(400).json({ error: 'Invalid GSTIN format' });
    }
    // Replace with your GST API logic
    // For demo, return valid
    res.json({
      gstin,
      valid: true,
      name: 'Demo Supplier',
      address: 'Demo Address',
      state: 'Demo State',
      businessType: 'Demo Type'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify GSTIN', details: err.message });
  }
};


// const Supplier = require('../models/supplierModel');
// const axios = require('axios');
// const cloudinary = require("../utils/cloudinary/cloudinary");

// // Create supplier
// // exports.createSupplier = async (req, res) => {
// //   try {
// //     let supplierData = req.body;
// //     // Parse bank field if sent as string
// //     if (supplierData.bank && typeof supplierData.bank === 'string') {
// //       supplierData.bank = JSON.parse(supplierData.bank);
// //     }

// //     // Auto-generate supplier code
// //     const lastSupplier = await Supplier.findOne({}, {}, { sort: { createdAt: -1 } });
// //     let supplierCode = 'SUP001';
// //     if (lastSupplier && lastSupplier.supplierCode) {
// //       const lastNum = parseInt(lastSupplier.supplierCode.replace('SUP', ''));
// //       supplierCode = 'SUP' + String(lastNum + 1).padStart(3, '0');
// //     }
// //     supplierData.supplierCode = supplierCode;

// //     // Cloudinary image upload
// //     let imageUrl = '';
// //     if (req.file) {
// //       const cloudinary = require('cloudinary').v2;
// //       cloudinary.config({
// //         cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// //         api_key: process.env.CLOUDINARY_API_KEY,
// //         api_secret: process.env.CLOUDINARY_API_SECRET,
// //       });
// //       const result = await cloudinary.uploader.upload(req.file.path, {
// //         folder: 'suppliers',
// //       });
// //       imageUrl = result.secure_url;
// //       supplierData.image = imageUrl;
// //     }

// //     const supplier = await Supplier.create(supplierData);
// //     res.status(201).json(supplier);
// //   } catch (err) {
// //     res.status(500).json({ error: 'Failed to create supplier', details: err.message });
// //   }
// // };
// exports.createSupplier = async (req, res) => {
//   try {
//     let supplierData = req.body;

//     // Parse bank field if it's a stringified object
//     if (supplierData.bank && typeof supplierData.bank === 'string') {
//       supplierData.bank = JSON.parse(supplierData.bank);
//     }

//     // Auto-generate supplierCode (e.g., SUP001, SUP002, etc.)
//     const lastSupplier = await Supplier.findOne(
//       { supplierCode: { $ne: null } },
//       {},
//       { sort: { createdAt: -1 } }
//     );

//     let supplierCode = 'SUP001';
//     if (lastSupplier && lastSupplier.supplierCode) {
//       const lastNum = parseInt(lastSupplier.supplierCode.replace('SUP', '')) || 0;
//       supplierCode = 'SUP' + String(lastNum + 1).padStart(3, '0');
//     }
//     supplierData.supplierCode = supplierCode;

//     // // Handle image upload (single or multiple)
//     // if (req.file) {
//     //   // Single image upload
//     //   const result = await cloudinary.uploader.upload(req.file.path, {
//     //     folder: 'suppliers',
//     //   });
//     //   supplierData.image = result.secure_url;
//     // } else if (req.files && req.files.length > 0) {
//     //   // Multiple images upload
//     //   supplierData.images = [];
//     //   for (const file of req.files) {
//     //     const result = await cloudinary.uploader.upload(file.path, {
//     //       folder: 'suppliers',
//     //     });
//     //     supplierData.images.push({
//     //       url: result.secure_url,
//     //       public_id: result.public_id,
//     //     });
//     //   }
//     // }
    
//     // Cloudinary Image Upload (Single or Multiple Files)
//     const uploadedImages = req.files?.length
//       ? await Promise.all(
//           req.files.map((file) =>
//             cloudinary.uploader.upload(file.path, {
//               folder: "suppliers",
//             })
//           )
//         )
//       : req.file
//       ? [await cloudinary.uploader.upload(req.file.path, { folder: "suppliers" })]
//       : [];

//     // Always set images array
//     supplierData.images = uploadedImages.map((img) => ({
//       url: img.secure_url,
//       public_id: img.public_id,
//     }));

//     const supplier = await Supplier.create(supplierData);
//     res.status(201).json(supplier);
//   } catch (err) {
//     console.error('Create supplier error:', err);
//     res.status(500).json({
//       error: 'Failed to create supplier',
//       details: err.message,
//     });
//   }
// };

// exports.getAllSuppliers = async (req, res) => {
//   try {
//     const suppliers = await Supplier.find()
//       .populate({
//         path: 'country',
//         select: 'name code',
//       })
//       .populate({
//         path: 'state',
//         select: 'stateName stateCode',
//       })
//       .populate({
//         path: 'city',
//         select: 'cityName cityCode',
//       });
//     res.json(suppliers);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch suppliers', details: err.message });
//   }
// };

// // exports.getAllSuppliers = async (req, res) => {
// //   try {
// //     const suppliers = await Supplier.find();
// //     res.json(suppliers);
// //   } catch (err) {
// //     res.status(500).json({ error: 'Failed to fetch suppliers', details: err.message });
// //   }
// // };

// // Get single supplier
// exports.getSupplierById = async (req, res) => {
//   try {
//     const supplier = await Supplier.findById(req.params.id);
//     if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
//     res.json(supplier);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch supplier', details: err.message });
//   }
// };

// // Edit supplier
// exports.updateSupplier = async (req, res) => {
//   try {
//     let updateData = req.body;
//     // Parse bank field if it's a stringified object
//     if (updateData.bank && typeof updateData.bank === 'string') {
//       updateData.bank = JSON.parse(updateData.bank);
//     }

//     // Cloudinary Image Upload (Single or Multiple Files)
//     let uploadedImages = [];
//     if (req.files?.length) {
//       uploadedImages = await Promise.all(
//         req.files.map((file) =>
//           cloudinary.uploader.upload(file.path, {
//             folder: "suppliers",
//           })
//         )
//       );
//     } else if (req.file) {
//       uploadedImages = [await cloudinary.uploader.upload(req.file.path, { folder: "suppliers" })];
//     }

//     // Always set images array if any image uploaded
//     if (uploadedImages.length > 0) {
//       updateData.images = uploadedImages.map((img) => ({
//         url: img.secure_url,
//         public_id: img.public_id,
//       }));
//     }

//     const supplier = await Supplier.findByIdAndUpdate(req.params.id, updateData, { new: true });
//     if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
//     res.json(supplier);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to update supplier', details: err.message });
//   }
// };

// // Delete supplier
// exports.deleteSupplier = async (req, res) => {
//   try {
//     const supplier = await Supplier.findByIdAndDelete(req.params.id);
//     if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
//     res.json({ message: 'Supplier deleted' });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to delete supplier', details: err.message });
//   }
// };
// //   try {
// //     let supplierData = req.body;
// //     if (req.file) {
// //       supplierData.image = req.file.filename;
// //     }
// //     if (supplierData.bank && typeof supplierData.bank === 'string') {
// //       supplierData.bank = JSON.parse(supplierData.bank);
// //     }
// //     const supplier = await Supplier.create(supplierData);
// //     res.status(201).json(supplier);
// //   } catch (err) {
// //     res.status(500).json({ error: 'Failed to create supplier', details: err.message });
// //   }



// exports.verifyGSTIN = async (req, res) => {
//   const { gstin } = req.body;

//   try {
//     // Basic GSTIN format check (optional but good to validate)
//     if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin)) {
//       return res.status(400).json({ error: 'Invalid GSTIN format' });
//     }

//     const GST_API_KEY = process.env.GST_API_KEY;
//     const GST_API_URL = `https://api.gst-api.com/gstin/${gstin}`;

//     const response = await axios.get(GST_API_URL, {
//       headers: {
//         Authorization: `Bearer ${GST_API_KEY}`,
//       },
//     });

//     const data = response.data;

//     if (data && data.success) {
//       res.json({
//         gstin: data.data.gstin,
//         legalName: data.data.legal_name,
//         tradeName: data.data.trade_name,
//         address: data.data.address,
//         state: data.data.state,
//         businessType: data.data.business_nature,
//         valid: true,
//       });
//     } else {
//       res.status(400).json({ valid: false, error: data.message || 'Invalid GSTIN' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to verify GSTIN', details: err.message });
//   }
// };

// // const axios = require('axios');
// require('dotenv').config();

// // Step 1: Get Auth Token from GST API
// async function getAuthToken() {
//   try {
//     const response = await axios.post(
//       `${process.env.GST_API_URL}/commonapi/v1.0/authenticate`,
//       {
//         action: "ACCESSTOKEN",
//         username: process.env.GST_API_USERNAME,
//         password: process.env.GST_API_PASSWORD,
//         app_key: process.env.GST_API_APP_KEY
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     if (response.data.status_cd === "1") {
//       return {
//         token: response.data.auth_token,
//         sek: response.data.sek
//       };
//     } else {
//       throw new Error('Failed to get auth token');
//     }
//   } catch (error) {
//     throw new Error(`Auth Error: ${error.response?.data || error.message}`);
//   }
// }

// // Step 2: Verify GSTIN using the token
// exports.verifyGSTIN = async (req, res) => {
//   const { gstin } = req.body;

//   if (!gstin) {
//     return res.status(400).json({ error: "GSTIN is required" });
//   }

//   try {
//     // Get auth token
//     const { token, sek } = await getAuthToken();

//     // Make GSTIN verification request
//     const gstResponse = await axios.post(
//       `${process.env.GST_API_URL}/gst/verify`,
//       { gstin },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     // OPTIONAL: If response is encrypted, decrypt using `sek`
//     // For example, if response.data.data is encrypted:
//     // const decryptedData = decryptUsingSEK(gstResponse.data.data, sek);
//     // return res.json(decryptedData);

//     // For now, assume plain JSON response:
//     res.json(gstResponse.data);
//   } catch (error) {
//     console.error("GSTIN verification error:", error);
//     res.status(500).json({
//       error: "Failed to verify GSTIN",
//       details: error.response?.data || error.message
//     });
//   }
// };



// // GSTIN verify and fetch real data
// // exports.verifyGSTIN = async (req, res) => {
// //   const { gstin } = req.body;
// //   try {
// //     // Replace with a real GST API endpoint and key
// //     const GST_API_URL = `https://api.gstnumberapi.com/v1/gstin/${gstin}`;
// //     // const GST_API_KEY = 'YOUR_API_KEY';
// //     // const response = await axios.get(GST_API_URL, { headers: { 'x-api-key': GST_API_KEY } });
// //     // For demo, just echo gstin
// //     // Uncomment above and add your API key for real data
// //     // const data = response.data;
// //     // res.json(data);
// //     res.json({ gstin, valid: true, name: 'Demo Supplier', address: 'Demo Address', state: 'Demo State', businessType: 'Demo Type' });
// //   } catch (err) {
// //     res.status(500).json({ error: 'Failed to verify GSTIN', details: err.message });
// //   }
// // };

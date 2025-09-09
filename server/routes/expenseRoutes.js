// const express = require("express");
// const multer = require("multer");
// const Expense = require("../models/ExpenseReportModal.js");

// const router = express.Router();

// // multer setup for image upload
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) =>
//     cb(null, Date.now() + "-" + file.originalname),
// });

// const upload = multer({ storage });

// // POST expense
// router.post("/", upload.single("receipt"), async (req, res) => {
//   try {
//     const newExpense = new Expense({
//       date: req.body.date,
//       paymentStatus: req.body.paymentStatus,
//       expenseTitle: req.body.expenseTitle,
//       notes: req.body.notes,
//       paymentMode: req.body.paymentMode,
//       paidTo: req.body.paidTo,
//       amount: req.body.amount,
//       receipt: req.file ? req.file.filename : null,
//     });

//     await newExpense.save();
//     res.status(201).json({ message: "Expense saved successfully", newExpense });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// // ✅ GET all expenses
// router.get("/", async (req, res) => {
//   try {
//     const expenses = await Expense.find().sort({ createdAt: -1 }); // latest first
//     res.status(200).json(expenses);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

// const express = require("express");
// const multer = require("multer");
// const Expense = require("../models/ExpenseReportModal.js");
// const cloudinary = require("../utils/cloudinary/cloudinary.js");

// const router = express.Router();

// // Multer setup (store temp only, cloudinary pe jayegi)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) =>
//     cb(null, Date.now() + "-" + file.originalname),
// });
// const upload = multer({ storage });

// // ✅ POST expense
// router.post("/", upload.single("receipt"), async (req, res) => {
//   try {
//     let receipt = [];

//     if (req.file) {
//       const uploaded = await cloudinary.uploader.upload(req.file.path, {
//         folder: "expense_receipts",
//       });

//       receipt.push({
//         url: uploaded.secure_url,
//         public_id: uploaded.public_id,
//       });
//     }

//     const newExpense = new Expense({
//       date: req.body.date,
//       paymentStatus: req.body.paymentStatus,
//       expenseTitle: req.body.expenseTitle,
//       notes: req.body.notes,
//       paymentMode: req.body.paymentMode,
//       paidTo: req.body.paidTo,
//       amount: req.body.amount,
//       receipt,
//     });

//     await newExpense.save();
//     res
//       .status(201)
//       .json({ message: "Expense saved successfully", newExpense });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ✅ GET all expenses
// router.get("/", async (req, res) => {
//   try {
//     const expenses = await Expense.find().sort({ createdAt: -1 });
//     res.status(200).json(expenses);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;



const express = require("express");
const multer = require("multer");
const Expense = require("../models/ExpenseReportModal.js");
const cloudinary = require("../utils/cloudinary/cloudinary.js");

const expenseController = require('../controllers/expenseController');

const router = express.Router();

// / ✅ Get Expenses with Pagination
router.get("/paginated", async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const expenses = await Expense.find()
      .sort({ date: -1 }) // latest first
      .skip(skip)
      .limit(limit);

    const total = await Expense.countDocuments();

    res.json({
      expenses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Dashboard summary: total expenses amount and count
router.get("/summary", async (req, res) => {
  try {
    const expenses = await Expense.find();
    const totalAmount = expenses.reduce(
      (sum, exp) => sum + (Number(exp.amount) || 0),
      0
    );
    const totalCount = expenses.length;

    res.json({ totalAmount, totalCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Multer setup (store temp only, cloudinary pe jayegi)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ POST expense
router.post("/", upload.single("receipt"), async (req, res) => {
  try {
    let receipt = [];

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "expense_receipts",
      });

      receipt.push({
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      });
    }

    const newExpense = new Expense({
      date: req.body.date,
      paymentStatus: req.body.paymentStatus,
      expenseTitle: req.body.expenseTitle,
      notes: req.body.notes,
      paymentMode: req.body.paymentMode,
      paidTo: req.body.paidTo,
      amount: req.body.amount,
      receipt,
    });

    await newExpense.save();
    res
      .status(201)
      .json({ message: "Expense saved successfully", newExpense });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });

    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET single expense (for edit form pre-fill)
router.get("/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ error: "Expense not found" });
    res.status(200).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE expense
router.put("/:id", upload.single("receipt"), async (req, res) => {
  try {
    let updateData = {
      date: req.body.date,
      paymentStatus: req.body.paymentStatus,
      expenseTitle: req.body.expenseTitle,
      notes: req.body.notes,
      paymentMode: req.body.paymentMode,
      paidTo: req.body.paidTo,
      amount: req.body.amount,
    };

    // If new receipt uploaded → replace old
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "expense_receipts",
      });

      updateData.receipt = [
        {
          url: uploaded.secure_url,
          public_id: uploaded.public_id,
        },
      ];
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true } // return updated doc
    );

    if (!updatedExpense)
      return res.status(404).json({ error: "Expense not found" });

    res.status(200).json({
      message: "Expense updated successfully",
      updatedExpense,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;


// ✅ Get Expenses with Pagination
exports.getExpenses = async (req, res) => {
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
};

// Dashboard summary: total expenses amount and count
exports.getTotalExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const totalAmount = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
    const totalCount = expenses.length;
    res.json({ totalAmount, totalCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

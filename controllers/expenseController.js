const Expense = require("../models/Expense");
const { success, error } = require("../utils/response");

exports.createExpense = async (req, res) => {
  try {
    const { amount, category, notes, date } = req.body;
    if (amount == null || isNaN(amount))
      return error(res, "amount is required and must be a number", 400);

    const expense = await Expense.create({
      userId: req.user._id,
      amount,
      category: category?.trim() || "Other",
      notes: notes || "",
      date: date ? new Date(date) : new Date(),
    });
    return success(res, expense, "Expense created", 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const filter = { userId: req.user._id };
    if (category) filter.category = category;

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Expense.find(filter).sort({ date: -1 }).skip(skip).limit(Number(limit)),
      Expense.countDocuments(filter),
    ]);

    return success(
      res,
      { items, total, page: Number(page), limit: Number(limit) },
      "Expenses fetched"
    );
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getMonthlyExpenses = async (req, res) => {
  try {
    const now = new Date();
    const year = Number(req.query.year) || now.getFullYear();
    const month = Number(req.query.month) || now.getMonth() + 1; // 1-12

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const items = await Expense.find({
      userId: req.user._id,
      date: { $gte: start, $lt: end },
    }).sort({ date: -1 });

    const total = items.reduce((sum, e) => sum + e.amount, 0);
    return success(res, { items, total, year, month }, "Monthly expenses");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      category: req.body.category?.trim() || "Other",
    };

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      payload,
      { new: true }
    );
    if (!expense) return error(res, "Expense not found", 404);
    return success(res, expense, "Expense updated");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!expense) return error(res, "Expense not found", 404);
    return success(res, { id: expense._id }, "Expense deleted");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

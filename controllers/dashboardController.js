const Expense = require("../models/Expense");
const Borrow = require("../models/Borrow");
const { success, error } = require("../utils/response");

exports.getSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [expenseAgg, receiveAgg, payAgg] = await Promise.all([
      Expense.aggregate([
        { $match: { userId, date: { $gte: start, $lt: end } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Borrow.aggregate([
        { $match: { userId, type: "RECEIVE", status: "PENDING" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Borrow.aggregate([
        { $match: { userId, type: "PAY", status: "PENDING" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    return success(res, {
      totalExpenses: expenseAgg[0]?.total || 0,
      totalToReceive: receiveAgg[0]?.total || 0,
      totalToPay: payAgg[0]?.total || 0,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    }, "Dashboard summary");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

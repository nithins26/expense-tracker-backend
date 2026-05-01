const Borrow = require("../models/Borrow");
const { success, error } = require("../utils/response");

exports.createBorrow = async (req, res) => {
  try {
    const { personName, type, amount, notes, date, status } = req.body;
    if (!personName) return error(res, "personName is required", 400);
    if (!["RECEIVE", "PAY"].includes(type))
      return error(res, "type must be RECEIVE or PAY", 400);
    if (amount == null || isNaN(amount))
      return error(res, "amount is required and must be a number", 400);

    const entry = await Borrow.create({
      userId: req.user._id,
      personName,
      type,
      amount,
      notes: notes || "",
      status: status || "PENDING",
      date: date ? new Date(date) : new Date(),
    });
    return success(res, entry, "Borrow entry created", 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getBorrows = async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = { userId: req.user._id };
    if (status) filter.status = status;
    if (type) filter.type = type;
    const items = await Borrow.find(filter).sort({ date: -1 });
    return success(res, items, "Borrow entries fetched");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.updateBorrow = async (req, res) => {
  try {
    const { type, status } = req.body;
    if (type && !["RECEIVE", "PAY"].includes(type))
      return error(res, "type must be RECEIVE or PAY", 400);
    if (status && !["PENDING", "SETTLED"].includes(status))
      return error(res, "status must be PENDING or SETTLED", 400);

    const entry = await Borrow.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!entry) return error(res, "Entry not found", 404);
    return success(res, entry, "Entry updated");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.deleteBorrow = async (req, res) => {
  try {
    const entry = await Borrow.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!entry) return error(res, "Entry not found", 404);
    return success(res, { id: entry._id }, "Entry deleted");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const mongoose = require("mongoose");

const CATEGORIES = ["EMI", "Investment", "Food", "Medical", "Travel", "Other"];

const expenseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, default: "Other", trim: true },
    notes: { type: String, default: "" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

module.exports = mongoose.model("Expense", expenseSchema);
module.exports.CATEGORIES = CATEGORIES;

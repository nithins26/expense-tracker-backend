const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    personName: { type: String, required: true, trim: true },
    type: { type: String, enum: ["RECEIVE", "PAY"], required: true },
    amount: { type: Number, required: true, min: 0 },
    notes: { type: String, default: "" },
    status: { type: String, enum: ["PENDING", "SETTLED"], default: "PENDING" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

module.exports = mongoose.model("Borrow", borrowSchema);

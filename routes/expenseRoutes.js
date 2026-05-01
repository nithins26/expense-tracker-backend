const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  createExpense,
  getExpenses,
  getMonthlyExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

router.use(auth);
router.post("/", createExpense);
router.get("/", getExpenses);
router.get("/monthly", getMonthlyExpenses);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;

const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  createBorrow,
  getBorrows,
  updateBorrow,
  deleteBorrow,
} = require("../controllers/borrowController");

router.use(auth);
router.post("/", createBorrow);
router.get("/", getBorrows);
router.put("/:id", updateBorrow);
router.delete("/:id", deleteBorrow);

module.exports = router;

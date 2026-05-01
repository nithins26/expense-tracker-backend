const { error } = require("../utils/response");

const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  console.error("❌ Error:", err.message);
  return error(res, err.message || "Server Error", status);
};

module.exports = { notFound, errorHandler };

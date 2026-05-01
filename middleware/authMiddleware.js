const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { error } = require("../utils/response");

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return error(res, "Not authorized, no token", 401);
    }
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return error(res, "User not found", 401);
    req.user = user;
    next();
  } catch (err) {
    return error(res, "Not authorized, token failed", 401);
  }
};

module.exports = authMiddleware;

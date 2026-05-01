const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { success, error } = require("../utils/response");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return error(res, "username and password are required", 400);
    if (password.length < 6)
      return error(res, "Password must be at least 6 characters", 400);

    const exists = await User.findOne({ username });
    if (exists) return error(res, "Username already taken", 409);

    const user = await User.create({ username, password });
    return success(
      res,
      { id: user._id, username: user.username, token: generateToken(user._id) },
      "User registered",
      201
    );
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return error(res, "username and password are required", 400);

    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password)))
      return error(res, "Invalid credentials", 401);

    return success(
      res,
      { id: user._id, username: user.username, token: generateToken(user._id) },
      "Login successful"
    );
  } catch (err) {
    return error(res, err.message, 500);
  }
};

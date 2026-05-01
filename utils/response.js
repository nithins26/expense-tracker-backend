const success = (res, data = {}, message = "OK", status = 200) =>
  res.status(status).json({ success: true, data, message });

const error = (res, message = "Something went wrong", status = 500, data = null) =>
  res.status(status).json({ success: false, data, message });

module.exports = { success, error };

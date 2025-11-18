function success(res, { data = null, status = 200, message = "Success." }) {
  return res.status(status).json({ success: true, data, message });
}

function error(
  res,
  { status = 400, code = "INTERNAL_ERROR", message = "Error", details = null }
) {
  return res
    .status(status)
    .json({ success: false, data: null, message, code, details });
}

module.exports = { success, error };

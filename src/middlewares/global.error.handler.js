function globalErrorHandler(err, req, res, next) {
  if (err.isOperational) {
    console.log("Operational Error - ", err);
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }
  console.log("Non operational Error - ", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}

export default globalErrorHandler;

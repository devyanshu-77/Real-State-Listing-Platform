class ApiResponse {
  constructor(statuscode, success, message, data = null, error = null) {
    this.statuscode = statuscode;
    this.success = success;
    this.message = message;
    if (null !== data) this.data = data;
    if (null !== error) this.error = error;
  }

  static success(res, message, data = null, statuscode = 200) {
    const response = new ApiResponse(statuscode, true, message, data);
    return res.status(statuscode).json(response);
  }

  static error(res, message, errorDetails, statuscode = 500) {
    const response = new ApiResponse(
      statuscode,
      false,
      message,
      null,
      errorDetails,
    );
    return res.status(statuscode).json(response);
  }
}

export default ApiResponse;

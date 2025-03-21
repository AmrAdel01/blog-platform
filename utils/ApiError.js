// Desc: Custom error class for handling API operation errors (predictable errors)
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500; // Default to 500 if undefined
    this.status = String(this.statusCode).startsWith("4") ? "fail" : "error";
    this.isOperational = true; // Indicates that this is a known (operational) error
  }
}

module.exports = ApiError;

const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("./../utils/ApiError");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  console.log("Headers Received:", req.headers); // Log all headers

  // Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Extracted Token:", token); // Log extracted token

    if (!token) {
      return next(new ApiError("No token provided", 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded); // Log decoded payload

      // Find user by ID and exclude password
      const user = await userModel.findById(decoded.id).select("-password");
      if (!user) {
        return next(new ApiError("User not found", 401));
      }

      // Attach user to request object
      req.user = user;
      console.log("User Attached to Request:", req.user); // Log user

      // Proceed to next middleware/route handler
      next();
    } catch (error) {
      console.log("Token Verification Error:", error.message); // Log error
      return next(new ApiError("Invalid token", 401));
    }
  } else {
    return next(new ApiError("Not authorized, no token", 401));
  }
});

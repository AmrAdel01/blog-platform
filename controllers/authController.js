const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const ApiError = require("./../utils/ApiError");

const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

exports.signUp = asyncHandler(async (req, res, next) => {
  const { userName, email, password, confirmPassword } = req.body;
  const userExist = await userModel.findOne({ email });
  if (userExist) {
    return next(new ApiError(`User ${userName} already exists`, 401));
  }
  if (password !== confirmPassword) {
    return next(new ApiError("Passwords do not match"));
  }
  const user = await userModel.create({
    userName,
    email,
    password,
    confirmPassword,
  });
  const token = generateToken(user._id);
  console.log("Generated Token:", token);

  res.status(200).json({
    message: "User registered successfully",
    data: user,
    token: generateToken(user._id),
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new ApiError(`User ${email} not found`));
  } else {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ApiError("Invalid email or password"));
    }
    res.status(200).json({
      message: "User logged in successfully",
      user: { id: user._id, name: user.userName, email: user.email },
      token: generateToken(user._id),
    });
  }
});

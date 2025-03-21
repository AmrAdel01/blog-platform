const express = require("express");
const { signUp, login } = require("./../controllers/authController");
const {
  signUpValidations,
  loginValidations,
} = require("./../utils/validator/userValidation");

const router = express.Router();

router.route("/signUp").post(signUpValidations, signUp);

router.route("/login").post(loginValidations, login);

module.exports = router;

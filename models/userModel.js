const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Name must be required "],
    },
    email: {
      type: String,
      required: [true, "Email must be required "],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password must be required "],
      minlength: 8,
      // select: false,
    },
  },
  { timestamps: true }
);
// hasing password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // genSalt { function from the bcrypt library used to generate a cryptographic salt, which is a random string added to passwords before hashing }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email!"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Email is not valid"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE & SAVE!!!
      validator: function (val) {
        return val === this.password;
      },
      message: "Passwords are not the same",
    },
  },
});

userSchema.pre("save", async function () {
  // only run if the password is actually modified
  if (!this.isModified("password")) return;

  // Hash the password with the cost of 12 O(2^salt)
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the passwordConfirm field
  this.passwordConfirm = undefined;
});

module.exports = mongoose.model("User", userSchema);

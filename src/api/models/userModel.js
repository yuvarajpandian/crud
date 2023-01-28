const mongoose = require("mongoose");
const validator = require("validator");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name!"],
  },
  email: {
    type: String,
    required: [true, "please enter your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please enter a valid email"],
  },
  role: {
    type: String,
    enum: ["seller", "buyer", "admin"],
    required: [true, "please select role"]
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
    minlength: 5,
    maxlength: 10,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password"],
     validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "passwords are not the same!!",
    },
    select: false
  },
  createdAt: { type: Date, default: new Date(), select: false },
  updatedAt: { type: Date, default: new Date(), select: false },
});

const userModel = mongoose.model("users", schema);

module.exports = userModel;

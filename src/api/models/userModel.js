const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
    required: [true, "please select role"],
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
    select: false,
  },
  createdAt: { type: Date, default: new Date(), select: false },
  updatedAt: { type: Date, default: new Date(), select: false },
  passwordChangedAt: { type: Date, default: "", select: false },
  refreshToken:{type:String,default: null}
});

schema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 11);

  this.passwordConfirm = undefined;

  next();
});

schema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

schema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

schema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTImeStamp = parseInt(this.passwordChangedAt / 1000, 10);

    return changedTImeStamp > JWTTimestamp;
  }

  return false;
};
const adminModel = mongoose.model("admin", schema);
const buyerModel = mongoose.model("buyer", schema);
const sellerModel = mongoose.model("seller", schema);

module.exports = {adminModel,buyerModel,sellerModel};

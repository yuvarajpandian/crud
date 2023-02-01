const express = require("express");
const router = express.Router();
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const userModel = require("../models/userModel");

const dotenv = require("dotenv");
dotenv.config({ path: "../../config/nodeEnvironment.env" });
const authenticationService = require("../services/authenticationService");

const createSendToken = (user, statusCode, res) => {
  const token = authenticationService.signInToken(user._id);

  // removing the pass from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: "successfully login",
    token,
    data: {
      user: user,
    },
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("you are not logged in, please login to access", 401)
    );
  }

  const decoded = await authenticationService.verifyToken(token);

  const currentUser = await userModel.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("the user belonging to the token no longer exists", 401)
    );
  }
  req.user = currentUser;
  next();
});

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return next(new AppError("please provie both email and password", 404));
  }

  let userInfo = await authenticationService.getLoginUser(email);

  if (userInfo) {
    if (userInfo.email) {

      const checkPassWord = await userInfo.correctPassword(password, userInfo.password);
      if (checkPassWord) {

        createSendToken(userInfo, 200, res);


      } else {
        return next(new AppError("incorrect password", 404));
      }
    }
  } else {
    return next(new AppError("provide valid email address", 404));
  }
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await authenticationService.findUserById(req.user.id);

  console.log(req.body.passwordCurrent, user.password);
  const checkPassWord = await user.correctPassword(req.body.passwordCurrent, user.password)
  console.log(checkPassWord);
  if (!checkPassWord) {
    return next(new AppError("Your current Password is wrong!", 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);

})



const userService = require("../services/userService");
const express = require("express");

const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");

exports.signIn = catchAsync(async (req, res, next) => {
  let payload = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  };

  let response = await userService.registerUser(payload);

  res.status(201).json({
    message: "registerd successfully",
    response,
  });
});

exports.getAllUserDetails = async (req, res, next) => {

  try {
    let allUserDetails = await userService.getUserList();
    if (allUserDetails.length) {
      res.status(201).json({
        message: "successfully getted all user details",
        data: allUserDetails,
      });
    } else {
      return next(new AppError("data not found", 404));
    }
  } catch (error) {
    res.status(500).json({
      stack: error.stack,
      message: error.message,
    });
  }
};

exports.deleteSingleUser = async (req, res, next) => {
  try {
    let id = req.params.id;

    let deletedUserDetail = await userService.deleteUser(id);
    if (deletedUserDetail) {
      res.status(201).json({
        message: "sucessfully deleted",
        data: deletedUserDetail,
      });
    } else {
      res.status(201).json({
        message: "not data found",
        data: deletedUserDetail,
      });
    }
  } catch (error) {
    res.status(500).json({
      stack: error.stack,
      message: error.message,
    });
  }
};

exports.getSingleUserDetail = catchAsync(async (req, res, next) => {
  let id = req.params.id;
  if (id.length) {
    let fetchedData = await userService.getSingleUserData(id);
   

    if (fetchedData) {
      res.status(200).json({
        message: "data successfully fetched",
        response: fetchedData,
      });
    }
  }
});

exports.updateSingleUserDetails = catchAsync(async (req, res, next) => {
  let payload = {};
  let id = req.params.id;

  if (req.body.name || req.body.email || req.body.role ) {
    if (req.body.name) {
      payload.name = req.body.name;
    }
    if (req.body.email) {
      payload.email = req.body.email;
    }
    if (req.body.role) {
      payload.role = req.body.role;
    }

    payload.updatedAt = new Date();

    let response = await userService.updateOne(id, payload);
    res.status(201).json({
      message: "succesfuly updated",
      data: response,
    });
  } else {
    return next(new AppError("data not found to update", 404));
  }
});

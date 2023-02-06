const userService = require("../services/userService");
const express = require("express");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const ApiFeature = require("../helpers/apiFeatures");
const { buyerModel,adminModel,sellerModel } = require("../models/userModel");

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
    let allUserDetails = await userService.getUserList(req.query);
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
// exports.getAllUserDetails = async (req, res, next) => {

//   try {
//     let features = new ApiFeature(buyerModel.find(),req.query).filter().sort()
    
  
// allUserDetails = await features.query;


//     if (allUserDetails.length) {
//       res.status(201).json({
//         message: "successfully getted all user details",
//         data: allUserDetails,
//       });
//     } else {
//       return next(new AppError("data not found", 404));
//     }
//   } catch (error) {
//     res.status(500).json({
//       stack: error.stack,
//       message: error.message,
//     });
//   }
// };

exports.deleteSingleUser = async (req, res, next) => {
  try {
    let id = req.params.id;
    let role = req.query.role;
    let deletedUserDetail;
    if(role == "buyer"){
      deletedUserDetail = await userService.deleteBuyerUser(id);
    }
    if(role === "seller"){
      deletedUserDetail = await userService.deleteSellerUser(id);
    }
  

  
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
  let role = req.query.role;
  let fetchedData;
  if (id.length) {

   if(role === "buyer"){
    fetchedData = await userService.getSingleBuyerData(id)
   }
   if(role === "seller"){
    fetchedData = await userService.getSingleSellerData(id);
   }

    if (fetchedData) {
      res.status(200).json({
        message: "data successfully fetched",
        response: fetchedData,
      });
    }
  }else{
    return next(new AppError("no data found",404))
  }
});

exports.updateSingleUserDetails = catchAsync(async (req, res, next) => {
  let payload = {};
  let id = req.user.id;
  let role = req.user.role;
  let response;

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

    if(role === "admin"){
      response = userService.updateAdmin(id,payload)
    }
    if(role === "buyer"){
      response = userService.updateBuyer(id,payload)
    }
    if(role === "seller"){
      response = userService.updateSeller(id,payload)
    }
    res.status(201).json({
      message: "succesfuly updated",
      data: response,
    });
  } else {
    return next(new AppError("data not found to update", 404));
  }
});

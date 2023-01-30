const userService = require("../services/userService");
const express = require("express");
const router = express.Router();
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
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
  })
);
router.get("/allUsers", async (req, res, next) => {
  try {
    let allUserDetails = await userService.getUserList();
    res.status(201).json({
      message: "successfully getted all user details",
      data: allUserDetails,
    });
  } catch (error) {
    res.status(500).json({
      stack: error.stack,
      message: error.message,
    });
  }
});

router.delete("/user/delete/:id", async (req, res, next) => {
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
});

router.put(
  "/user/update/:id",
  catchAsync(async (req, res, next) => {
    let payload = {};
    let id = req.params.id;

    if (req.body.name || req.body.email || req.body.role || req.body.password) {
      if (req.body.name) {
        payload.name = req.body.name;
      }
      if (req.body.email) {
        payload.email = req.body.email;
      }
      if (req.body.role) {
        payload.role = req.body.role;
      }
      if (req.body.password) {
        console.log(req.body.passwordConfirm);
        if (req.body.passwordConfirm) {
          if (req.body.password === req.body.passwordConfirm) {
            payload.password = req.body.password;
            payload.passwordConfirm = req.body.passwordConfirm;
          } else {
            return next(new AppError("password is miss matching", 404));
          }
        } else {
          return next(new AppError("please enter confirm password", 400));
        }
      }

      let response = await userService.updateAll(id, payload);
      res.status(201).json({
        message: "succesfuly updated",
        data: response,
      });
    } else {
      return next(new AppError("data not found", 404));
    }
  })
);

module.exports = router;

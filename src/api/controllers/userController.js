const userService = require("../services/userService");
const express = require("express");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      stack: error.stack,
      message: error.message,
    });
  }
});

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

router.put("/user/update/:id", async (req, res, next) => {
  try {
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
            res.status(400).json({
              message: "password is miss matching",
            });

            return;
          }
        } else {
          res.status(400).json({
            message: " please enter confirm password",
          });
          return;
        }
      }

      let response = await userService.updateAll(id, payload);
      res.status(201).json({
        message: "succesfuly updated",
        data: response,
      });
    } else {
      res.status(400).json({
        message: "data not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      stack: error.stack,
      message: error.message,
    });
  }
});

module.exports = router;

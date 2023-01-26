
const userService = require("../services/userService");
const express = require("express");

const router = express.Router();

router.post('/register', async (req, res, next) => {
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
      message: "registerd sucessfully" ,
     response
    });
  } catch (error) {
    res.status(500).json({
      stack: error.stack,
      message: error.message,
    });
  }
}
);

module.exports = router;
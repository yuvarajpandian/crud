const express = require("express");
const AppError = require("../helpers/appError");
const authRoute = require("./authRoutes");
const userRouter = require("./userRoutes");

const router = express.Router();
router.use('/liberationfolks',authRoute);
router.use('/liberationfolks',userRouter);
router.all("*", (req, res, next) => {
  next(
    new AppError(
      `cannot find ${req.originalUrl} is not found in this server`,
      404
    )
  );
});

module.exports = router;

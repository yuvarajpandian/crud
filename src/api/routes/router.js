const express = require("express");
const appError = require("../helpers/appError");

const userRouter = require("./userRoutes");

const router = express.Router();
router.use(userRouter);
router.all("*", (req, res, next) => {
  next(
    new appError(
      `cannot find ${req.originalUrl} is not found in this server`,
      404
    )
  );
});

module.exports = router;

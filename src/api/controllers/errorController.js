
const dotenv = require("dotenv");
dotenv.config({ path:'../../config'});
const handleCastError = (err) => {
  const message = `invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // const value = err.errmsg.match((/["'])(?:(?=(\\?))\2.)*?\1/)
  let message = `duplicate field value x, please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  let message = `invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// const handleJsonWebTokenError = (error) => {
//   return new AppError('Invalid Token, please login again', 401)
// }

// const handleTokenExpiredError = (error) => {
//   return new AppError('your token is expored, please login again', 401)
// }

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
    message: err.message,
  });
};
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
    });
  } else {
    console.error("Error!!");
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.name === "CastError") {
      error = handleCastError(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }
    if (error.name === "validationError") {
      error = handleValidationErrorDB(error);
    }
    if (error.name === "JsonWebTokenError") {
      error = handleJsonWebTokenError()
    }

    if (error.name === "TokenExpiredError") {
      error === handleTokenExpiredError()
    }
    sendErrorProd(error, res);
  }
};

const appError = require('../helpers/appError');

const sendError = (err, res) => {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      stack: err.stack,
      message: err.message,
    });
  };

  module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "error";
    
    sendError(err, res);}
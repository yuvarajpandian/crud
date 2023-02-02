const jwt = require('jsonwebtoken')
const { adminModel, buyerModel, sellerModel } = require("../models/userModel");
const { promisify } = require("util");
const dotenv = require("dotenv");
dotenv.config({ path: '../../config/nodeEnvironment.env' });

exports.getLoginAdmin = async (email) => {
  return await adminModel.findOne({ email }).select("+password");
}
exports.getLoginBuyer = async (email) => {
  return await buyerModel.findOne({ email }).select("+password");
}
exports.getLoginSeller = async (email) => {
  return await sellerModel.findOne({ email }).select("+password");
}


exports.signInToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.verifyToken = async (token) => {
  return await promisify(jwt.verify)(token, process.env.JWT_SECRET);
}

exports.findAdminById = async (id) => {
  return await adminModel.findById(id).select("+password").select("+passwordChangedAt");
}
exports.findBuyerById = async (id) => {
  return await buyerModel.findById(id).select("+password").select("+passwordChangedAt");
}
exports.findSellerById = async (id) => {
  return await sellerModel.findById(id).select("+password").select("+passwordChangedAt");
}

// exports.findAdminPasswordChangeAtById = async (id) => {
//   return await adminModel.findById(id).select("+passwordChangedAt");
// }
// exports.findBuyerPasswordChangeAtById = async (id) => {
//   return await buyerModel.findById(id).select("+passwordChangedAt");
// }
// exports.findSellerPasswordChangeAtById = async (id) => {
//   return await sellerModel.findById(id).select("+passwordChangedAt");
// }




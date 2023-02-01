const jwt = require('jsonwebtoken')
const userModel = require("../models/userModel");
const { promisify } = require("util");
const dotenv = require("dotenv");
dotenv.config({ path:'../../config/nodeEnvironment.env'});

exports.getLoginUser = async(email) =>{
    return await userModel.findOne({email}).select("+password");
}

exports.signInToken = (id) => {
  return jwt.sign({  id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.verifyToken = async(token) => {
    return await promisify(jwt.verify)(token, process.env.JWT_SECRET);
} 

exports.findUserById = async (id) => {
  return await userModel.findById(id).select("+password");
}


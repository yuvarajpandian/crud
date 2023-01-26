const userModel = require("../models/userModel");

exports.registerUser = async (payload)=>{
    return await userModel.create({...payload});
};


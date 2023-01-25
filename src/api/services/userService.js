const userModel = require("../models/userModel");

registerUser = async (payload)=>{
    return await userModel.create({...payload});
};

exports = registerUser;
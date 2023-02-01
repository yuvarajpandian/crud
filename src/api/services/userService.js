const userModel = require("../models/userModel");

exports.registerUser = async (payload)=>{
    return await userModel.create({...payload});
};

exports.getUserList = async () =>{
    return await userModel.find();
}
exports.getSingleUserData = async (id) =>{
return await userModel.findById(id);
}

exports.deleteUser = async (payload) =>{
    return await userModel.findByIdAndDelete(payload)
}
exports.updateOne = async (id,payload) =>{
    return await userModel.findByIdAndUpdate(id,payload,{new:true})
}




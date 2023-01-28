const userModel = require("../models/userModel");

exports.registerUser = async (payload)=>{
    return await userModel.create({...payload});
};

exports.getUserList = async () =>{
    return await userModel.find();
}

exports.deleteUser = async (payload) =>{
    return await userModel.findByIdAndDelete(payload)
}
exports.updateAll = async (id,payload) =>{
    return await userModel.findByIdAndUpdate(id,payload,{new:true})
}



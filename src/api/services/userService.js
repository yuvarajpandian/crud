const { adminModel, buyerModel, sellerModel } = require("../models/userModel");

exports.registerUser = async (payload) => {

    const role = payload.role;

    if (role === "admin") {
        return await adminModel.create(payload);
    }
    if (role === "buyer") {
        return await buyerModel.create(payload);
    }
    if (role === "seller") {
        return await sellerModel.create(payload);
    }

};

exports.getUserList = async () => {
    const adminList = await adminModel.find();
    const buyerList = await buyerModel.find();
    const seller = await sellerModel.find();
    const allUserList = [...adminList, ...buyerList, ...seller]
    return allUserList;
}
exports.getSingleAdminData = async (id) => {
    return await adminModel.findById(id);
}

exports.getSingleBuyerData = async (id) => {
    return await buyerModel.findById(id);
}

exports.getSingleSellerData = async (id) => {
    return await sellerModel.findById(id);
}


exports.deleteAdminUser = async (id) => {
    return await adminModel.findByIdAndDelete(id)
}
exports.deleteBuyerUser = async (id) => {
    return await buyerModel.findByIdAndDelete(id)
}
exports.deleteSellerUser = async (id) => {
    return await sellerModel.findByIdAndDelete(id)
}
exports.updateAdmin = async (id, payload) => {
    return await adminModel.findByIdAndUpdate(id, payload, { new: true })
}

exports.updateBuyer = async (id, payload) => {
    return await buyerModel.findByIdAndUpdate(id, payload, { new: true })
}
exports.updateSeller = async (id, payload) => {
    return await sellerModel.findByIdAndUpdate(id, payload, { new: true })
}





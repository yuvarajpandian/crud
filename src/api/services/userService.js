const { adminModel, buyerModel, sellerModel } = require("../models/userModel");
const ApiFeature = require("../helpers/apiFeatures");

function paginate(userDetailArray, page, limit) {
  console.log(userDetailArray.length);
  let pageNo = page * 1 || 1;
  let limitNo = limit * 1 || 2;
  let skip = (pageNo - 1) * limitNo;
  console.log(skip, skip);
  userDetailArray.splice(0, skip);
  userDetailArray = userDetailArray.slice(0, limit);

  return userDetailArray;
}

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

exports.getUserList = async (payload) => {
  let adminData = new ApiFeature(adminModel.find(), payload).filter().sort();
  adminData = await adminData.query;
  let buyerData = new ApiFeature(buyerModel.find(), payload).filter().sort();
  buyerData = await buyerData.query;
  let sellerData = new ApiFeature(sellerModel.find(), payload).filter().sort();
  sellerData = await sellerData.query;
  let allUserDetails = [...adminData, ...buyerData, ...sellerData];
  allUserDetails = paginate(allUserDetails, payload.page, payload.limit);
  return allUserDetails;
};
exports.getSingleAdminData = async (id) => {
  return await adminModel.findById(id);
};

exports.getSingleBuyerData = async (id) => {
  return await buyerModel.findById(id);
};

exports.getSingleSellerData = async (id) => {
  return await sellerModel.findById(id);
};

exports.deleteAdminUser = async (id) => {
  return await adminModel.findByIdAndDelete(id);
};
exports.deleteBuyerUser = async (id) => {
  return await buyerModel.findByIdAndDelete(id);
};
exports.deleteSellerUser = async (id) => {
  return await sellerModel.findByIdAndDelete(id);
};
exports.updateAdmin = async (id, payload) => {
  return await adminModel.findByIdAndUpdate(id, payload, { new: true });
};

exports.updateBuyer = async (id, payload) => {
  return await buyerModel.findByIdAndUpdate(id, payload, { new: true });
};
exports.updateSeller = async (id, payload) => {
  return await sellerModel.findByIdAndUpdate(id, payload, { new: true });
};

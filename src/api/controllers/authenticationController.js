const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const dotenv = require("dotenv");
dotenv.config({ path: "../../config/nodeEnvironment.env" });
const authenticationService = require("../services/authenticationService");
const { decode } = require("jsonwebtoken");

const createSendToken = async (user, statusCode, res) => {
console.log(user,"user",user._id);
  const accessToken = authenticationService.signInToken(user._id);
  const refreshToken = authenticationService.createSendRefreshToken(user._id);
  // removing the pass from the output
  user.password = undefined;
  // user.refreshToken = refreshToken;
  
  let response = await authenticationService.findByAdminIdUpdate(user._id, refreshToken);

  res.status(statusCode).json({
    status: "successfully login",
    accessToken,
    refreshToken,
    data: {
      user: user,
      response : response
    },
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  let currentUser;
  let decoded ;
  const role = req.headers.role;
  // if (!(role === "admin" || "buyer" || "seller")) {
  //   return next(new AppError("provide valid role details", 404));
  // }
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("you are not logged in, please login to access", 401)
    );
  }
 decoded = await authenticationService.verifyToken(token);

  // if (role === "admin") {
    currentUser = await authenticationService.findAdminById(decoded.id);
  
  // }
  // if (role === "buyer") {
  //   currentUser = await authenticationService.findBuyerById(decoded.id);
  // }
  // if (role === "seller") {
  //   currentUser = await authenticationService.findSellerById(decoded.id);
  // }
  if (!currentUser) {
    return next(
      new AppError("the user belonging to the token no longer exists", 401)
    );
  }
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError("Password changed recently, please login again", 401)
    );
  }
  currentUser.password = undefined;
  currentUser.passwordChangedAt = undefined;
  req.user = currentUser;
  next();
});

exports.login = catchAsync(async (req, res, next) => {
  const role = req.body.role;
  const email = req.body.email;
  const password = req.body.password;
  let userInfo;
  if (!(role === "admin" || "buyer" || "seller")) {
    return next(new AppError("provide valid role to login", 404));
  }

  if (!email || !password) {
    return next(new AppError("please provie both email and password", 404));
  }

  if (role === "admin") {
    userInfo = await authenticationService.getLoginAdmin(email);
  }
  if (role === "buyer") {
    userInfo = await authenticationService.getLoginBuyer(email);
  }
  if (role === "seller") {
    userInfo = await authenticationService.getLoginSeller(email);
  }

  if (userInfo) {
    if (userInfo.email) {
      const checkPassWord = await userInfo.correctPassword(
        password,
        userInfo.password
      );
      if (checkPassWord) {
   
        createSendToken(userInfo, 200, res);
      } else {
        return next(new AppError("incorrect password", 404));
      }
    }
  } else {
    return next(new AppError("provide valid email address", 404));
  }
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const id = req.user.id;
  const role = req.user.role;
  let userInfo;
  if (!(role === "admin" || "buyer" || "seller")) {
    return next(new AppError("provide valid role to update password", 404));
  }
  if (role === "admin") {
    userInfo = await authenticationService.findAdminById(id);
  }
  if (role === "buyer") {
    userInfo = await authenticationService.findBuyerById(id);
  }
  if (role === "seller") {
    userInfo = await authenticationService.findSellerById(id);
  }
  if (req.body.passwordCurrent) {
    const checkPassWord = await user.correctPassword(
      req.body.passwordCurrent,
      userInfo.password
    );
  
    if (!checkPassWord) {
      return next(new AppError("Your current Password is wrong!", 401));
    }

    userInfo.password = req.body.password;
    userInfo.passwordConfirm = req.body.passwordConfirm;
    userInfo.passwordChangedAt = new Date() - 1000;
    await userInfo.save();

    createSendToken(req.user, 200, res);
  } else {
    return next(new AppError("please enter current password", 404));
  }
});


exports.refreshToken = catchAsync(async(req,res,next)=>{
  const refreshToken = req.body.refreshToken;
  if(refreshToken)
  {
    const decoded = await authenticationService.verifyToken(refreshToken);
    let  currentUser = await authenticationService.findAdminByIdAndToken(decoded.id,refreshToken)
    if(currentUser)
    {
      createSendToken(currentUser,200,res);
    }else{
      return next(
        new AppError("you are not logged in, please login to access", 401)
      );
    }
  }else{
    return next(
      new AppError("you are not logged in, please login to access", 401)
    );
  }

})

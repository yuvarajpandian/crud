const express = require('express');
const userController = require('../controllers/userController');
const authenticationController = require('../controllers/authenticationController')

const userRouter = express.Router();

userRouter.route("/register").post(userController.signIn);
userRouter.route("/allUsers").get(authenticationController.protect ,userController.getAllUserDetails);
userRouter.route( "/user/fetch/:id").get(userController.getSingleUserDetail);
userRouter.route("/user/delete/:id").delete(userController.deleteSingleUser);
userRouter.route( "/user/update").put(authenticationController.protect,userController.updateSingleUserDetails);

module.exports =userRouter;
const express = require('express');
const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter.use('',userController);

module.exports =userRouter;
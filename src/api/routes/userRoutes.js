const express = require('express');
const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter.use('/liberationfolks',userController);

module.exports =userRouter;
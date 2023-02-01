const express = require('express');
const authenticationController = require('../controllers/authenticationController');

const authRoute = express.Router();

authRoute.route('/login').post(authenticationController.login)
authRoute.route('/user/update-password').patch(authenticationController.protect,authenticationController.updatePassword)

module.exports = authRoute;
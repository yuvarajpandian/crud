const express = require('express');


const userRouter = require('./userRoutes')

const router = express.Router();
router.use(userRouter);
router.all("*", (req, res, next) => {

    res.status(404).json({
      message: `cannot find ${req.originalUrl} is not found in this server`,
    })
  });
  
module.exports = router;
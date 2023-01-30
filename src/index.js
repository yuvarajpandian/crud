const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const router = require('./api/routes/router')
const errorHandler = require('./api/controllers/errorController');
dotenv.config({ path: "./src/config/databaseConfig.env" });



app.use(express.json({ limit: "50kb" }));
app.use(router);
app.use(errorHandler);

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DB_URI, { useNewUrlParser: true })
  .then((res) => {
    console.log("DataBase successfully connected");
  })
  .catch((err) => {
    console.log("database is not connected", err);
  });


const server = app.listen(process.env.PORT, () => {
  console.log("listening to the port", process.env.PORT);
});


process.on('unhandledRejection' , err => {
  console.log(err.name,err.message)
  server.close(() =>{
    console.log("closing server")
    process.exit(1);
  })
});


process.on('uncaughtException', err =>{
  console.log(err.name, err.message);
  console.log("uncaughtException!!");
  console.log("closing server...");
  server.close(() => {
    process.exit(1);
  });
})
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const router = require('./api/routes/router')

dotenv.config({ path: "./src/config/databaseConfig.env" });



app.use(express.json({ limit: "50kb" }));
app.use(router);

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DB_URI, { useNewUrlParser: true })
  .then((res) => {
    console.log("DataBase successfully connected");
  })
  .catch((err) => {
    console.log("database is not connected", err);
  });

app.listen(process.env.PORT, () => {
  console.log("listening to the port", process.env.PORT);
});

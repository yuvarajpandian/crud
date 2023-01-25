const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require('./api/routes/userRoutes');
const app = express();

dotenv.config({ path: "./src/config/databaseConfig.env" });

app.use(userRoutes);

app.use(express.json({ limit: "50kb" }));

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

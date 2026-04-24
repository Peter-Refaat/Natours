const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]); // Force Node to use Google DNS

const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB Connection Successful! 🥸");
  })
  .catch((err) => {
    console.log(err.message);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App Running on Port ${port}...`);
});

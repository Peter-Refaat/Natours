const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]); // Force Node to use Google DNS

const mongoose = require("mongoose");

// Handling uncaught exceptions
// exit is MANDATORY
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception 💥 Shutting Down....");
  console.log(err.name, err.message);

  process.exit(1);
});

const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => {
  console.log("DB Connection Successful! 🥸");
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App Running on Port ${port}...`);
});

// Handling unhandled rejections
// exit is optional
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection 💥 Shutting Down....");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});

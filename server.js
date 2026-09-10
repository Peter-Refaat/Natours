import { setServers } from "dns";

setServers(["8.8.8.8", "8.8.4.4"]); // Force Node to use Google DNS

import { connect } from "mongoose";

// Handling uncaught exceptions
// exit is MANDATORY
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception 💥 Shutting Down....");
  console.log(err.name, err.message);

  process.exit(1);
});

import { config } from "dotenv";

config({ path: "./config.env" });

import app from "./app.js";

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD,
);

connect(DB).then(() => {
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

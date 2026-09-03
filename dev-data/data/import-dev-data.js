import { readFileSync } from "fs";
import { setServers } from "dns";
import { connect } from "mongoose";
import { config } from "dotenv";
import Tour from "../../models/tourModel.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

setServers(["8.8.8.8", "8.8.4.4"]); // Force Node to use Google DNS
config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD,
);

connect(DB)
  .then(() => {
    console.log("DB Connection Successful! 🥸");
  })
  .catch((err) => {
    console.log(err.message);
  });

const tours = JSON.parse(readFileSync(`${__dirname}/tours.json`, "utf-8"));

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data Successfuly loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data Successfuly Deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);

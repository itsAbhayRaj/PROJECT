import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    const server = app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is live on http://localhost:${process.env.PORT}`);
    });
    server.on("error", (error) => {
      console.log("Error: ", error);
      throw error;
    });
  })
  .catch((err) => {
    console.log("MONOGO DB Connection Failed: ", err);
  });

// console.log("Hello");

/*
// function connectDB(){}
// connectDB()

const app = express()

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    app.on('error',(error)=>{
        console.log('Error: ', error);
        throw error
    })

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    })
} catch (error) {
    console.log("Error: ", error);
    throw error;
  }
})();
*/

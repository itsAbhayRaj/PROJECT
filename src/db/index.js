import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB Connected: DB HOST: ${conn.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection Error: ", error);
        process.exit(1);
    }
};

export default connectDB;
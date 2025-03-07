import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: "bookManagement",
    });
    console.log("Connected");
  } catch (error) {
    console.error("Connection Failed:", error);
    process.exit(1);
  }
};

export default connectDB;

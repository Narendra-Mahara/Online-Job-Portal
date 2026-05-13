import mongoose from "mongoose";
import dns from "dns"; // Set custom DNS servers to avoid potential DNS resolution issues
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
    console.log("Database connected!!\n");
  } catch (error) {
    console.log("Database connection error!!!!\n", error);
  }
};

export default connectDB;

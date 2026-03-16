import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
    console.log("Database connected!!\n");
  } catch (error) {
    console.log("Database connection error!!!!\n", error);
  }
};

export default connectDB;

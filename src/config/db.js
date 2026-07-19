import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.log("MongoDB connection error ", err);
    process.exit(1);
  }
}

export default connectDB;

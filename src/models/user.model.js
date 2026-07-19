import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "property_owner", "user"],
    default: "user",
  },
});

const userModel = mongoose.model("user", userModel);
